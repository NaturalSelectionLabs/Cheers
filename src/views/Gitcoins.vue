<template>
    <div id="main" class="h-screen bg-gitcoin-bg overflow-y-auto">
        <div class="m-auto pb-32 pt-8 px-4 max-w-screen-lg">
            <div class="header flex items-center justify-between pb-4">
                <Button
                    size="sm"
                    class="
                        border-secondary-button-border
                        w-10
                        h-10
                        text-secondary-btn-text
                        bg-secondary-btn
                        shadow-secondary-btn
                    "
                    @click="back"
                >
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
                <div class="section-title text-center text-gitcoin-title text-2xl font-bold">Donations</div>
                <ImgHolder
                    class="inline-flex my-auto w-10 h-10 cursor-pointer"
                    :is-rounded="true"
                    :is-border="false"
                    :src="rss3Profile.avatar"
                    :alt="rss3Profile.username"
                    @click="toPublicPage(rns, ethAddress)"
                />
            </div>
            <GitcoinTitle class="mb-6" :grants="grants" :contributions="contribs" />
            <div
                class="gitcoin-gitcoins grid gap-6 grid-cols-1 sm:grid-cols-2"
                :class="{ 'pb-16': isOwner }"
                v-show="gitcoins.length !== 0"
            >
                <GitcoinCard
                    v-for="item in gitcoins"
                    :key="item.platform + item.identity + item.id"
                    :imageUrl="item.info.image_preview_url || defaultAvatar"
                    :name="item.info.title || 'Inactive Project'"
                    :contrib="item.info.total_contribs"
                    :amount="item.info.token_contribs"
                    @click="toSingleGitcoin(item.platform, item.identity, item.id, item.type)"
                ></GitcoinCard>
            </div>
            <div
                class="fixed bottom-2 left-0 right-0 flex gap-5 m-auto px-4 py-4 w-full max-w-md bg-btn-container"
                v-if="isOwner"
            >
                <Button
                    size="lg"
                    class="m-auto text-gitcoin-btn-m-text text-lg bg-gitcoin-btn-m shadow-gitcoin-btn-m"
                    @click="toSetupGitcoins"
                >
                    <span>Manage Donations</span>
                </Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import ImgHolder from '@/components/ImgHolder.vue';
import GitcoinTitle from '@/components/GitcoinTitle.vue';
import GitcoinCard from '@/components/GitcoinCard.vue';
import config from '@/config';
import RNSUtils from '@/common/rns';
import RSS3 from '@/common/rss3';
import { GeneralAsset, GeneralAssetWithTags } from '@/common/types';
import { RSS3Asset } from 'rss3-next/types/rss3';
import { debounce } from 'lodash';
import { getName } from '@/common/utils';

interface Profile {
    avatar: string;
    username: string;
    address: string;
    bio: string;
}

@Options({
    name: 'Gitcoins',
    components: { ImgHolder, Button, GitcoinTitle, GitcoinCard },
})
export default class Gitcoins extends Vue {
    rns: string = '';
    ethAddress: string = '';
    grants: number = 0;
    contribs: number = 0;
    gitcoins: GeneralAssetWithTags[] = [];
    isOwner: boolean = false;
    rss3Profile: Profile = {
        avatar: config.defaultAvatar,
        username: '',
        address: '',
        bio: '',
    };
    private defaultAvatar = config.defaultAvatar;
    scrollTop: number = 0;
    lastRoute: string = '';

    async mounted() {
        this.mountScrollEvent();
    }

    async initLoad() {
        this.lastRoute = this.$route.fullPath;
        this.contribs = 0;
        this.gitcoins = [];
        this.rss3Profile.avatar = config.defaultAvatar;

        await RSS3.reconnect();
        const rss3 = await RSS3.visitor();
        const owner: string = <string>rss3.account.address;
        await this.getAddress(owner);

        const profile = await rss3.profile.get(this.ethAddress);
        this.rss3Profile.avatar = profile?.avatar?.[0] || config.defaultAvatar;
        this.rss3Profile.username = profile?.name || '';
        this.rss3Profile.address = this.ethAddress;

        // Setup theme
        const themes = RSS3.getAvailableThemes(await rss3.assets.get(this.ethAddress));
        if (themes[0]) {
            document.body.classList.add(themes[0].class);
        } else {
            document.body.classList.remove(...document.body.classList);
        }

        const gitcoinsData = await RSS3.getAssetProfile(this.ethAddress, 'Gitcoin-Donation');
        if (gitcoinsData) {
            await this.loadGitcoin(await rss3.assets.get(this.ethAddress), gitcoinsData.assets);
        }
    }

    async getAddress(owner: string) {
        let address: string = '';
        if (config.subDomain.isSubDomainMode) {
            // Is subdomain mode
            address = getName();
        } else if (this.$route.params.address) {
            address = <string>this.$route.params.address;
        } else {
            return false;
        }

        if (address) {
            if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
                // Might be address type
                // Get RNS and redirect
                this.ethAddress = address;
                this.rns = await RNSUtils.addr2Name(address);
                if (this.rns !== '') {
                    window.location.href =
                        'https://' +
                        this.rns +
                        '.' +
                        config.subDomain.rootDomain +
                        window.location.pathname.replace(`/${address}`, '');
                }
            } else {
                // RNS
                this.rns = address;
                this.ethAddress = (await RNSUtils.name2Addr(address)).toString();
                if (parseInt(this.ethAddress) === 0) {
                    return false;
                }
            }

            this.isOwner = this.ethAddress === owner;
        }

        return true;
    }

    private getAssetOrder(asset: RSS3Asset) {
        let order = -1;
        asset.tags?.forEach((tag: string) => {
            if (tag.startsWith('pass:order:')) {
                order = parseInt(tag.substr(11));
            }
        });
        return order;
    }

    async loadGitcoin(assetsInRSS3File: RSS3Asset[], assetsGrabbed: GeneralAsset[]) {
        const assetsMerge: GeneralAssetWithTags[] = await Promise.all(
            (assetsGrabbed || []).map(async (ag: GeneralAssetWithTags) => {
                const origType = ag.type;
                if (config.hideUnlistedAsstes) {
                    ag.type = 'Invalid'; // Using as a match mark
                }
                for (const airf of assetsInRSS3File) {
                    if (
                        airf.platform === ag.platform &&
                        airf.identity === ag.identity &&
                        airf.id === ag.id &&
                        airf.type === origType
                    ) {
                        // Matched
                        ag.type = origType; // Recover type
                        if (airf.tags) {
                            ag.tags = airf.tags;
                        }
                        break;
                    }
                }
                return ag;
            }),
        );

        const GitcoinList: GeneralAssetWithTags[] = [];

        for (const am of assetsMerge) {
            if (am.type.includes('Gitcoin-Donation') && !am.tags?.includes('pass:hidden')) {
                this.contribs += <number>am.info.total_contribs;
                GitcoinList.push(am);
            }
        }

        this.gitcoins = GitcoinList.sort((a, b) => this.getAssetOrder(a) - this.getAssetOrder(b));

        this.grants = this.gitcoins.length;
    }

    toPublicPage(rns: string, ethAddress: string) {
        if (rns && config.subDomain.isSubDomainMode) {
            this.$router.push('/');
        } else {
            this.$router.push(`/${rns || ethAddress}`);
        }
    }

    back() {
        this.$router.push(config.subDomain.isSubDomainMode ? '/' : `/${this.rns || this.ethAddress}`);
    }

    toSetupGitcoins() {
        this.$router.push(`/setup/gitcoins`);
    }

    toGitcoin() {
        window.open(`https://gitcoin.co/`);
    }

    toSingleGitcoin(platform: string, identity: string, id: string, type: string) {
        this.$router.push(
            (config.subDomain.isSubDomainMode ? '' : `/${this.rns || this.ethAddress}`) +
                `/singlegitcoin/${platform}/${identity}/${id}/${type}`,
        );
    }

    mountScrollEvent() {
        const el = document.getElementById('main');
        if (el) {
            el.addEventListener(
                'scroll',
                debounce((ev) => {
                    this.scrollTop = el.scrollTop;
                }, 100),
            );
        }
    }

    activated() {
        if (this.lastRoute === this.$route.fullPath) {
            const el = document.getElementById('main');
            if (el) {
                el.scrollTop = this.scrollTop;
            }
        } else {
            this.initLoad();
        }
    }
}
</script>

<style></style>
