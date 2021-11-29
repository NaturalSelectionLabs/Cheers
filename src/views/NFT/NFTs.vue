<template>
    <div id="main" class="h-screen bg-nft-bg overflow-y-auto">
        <div class="m-auto pb-32 pt-8 px-4 max-w-screen-lg">
            <div class="header flex items-center justify-between pb-4">
                <Button
                    size="sm"
                    class="w-10 h-10 text-secondary-btn-text bg-secondary-btn shadow-secondary-btn"
                    @click="back"
                >
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
                <div class="section-title text-center text-nft-title text-2xl font-bold">NFTs</div>
                <ImgHolder
                    class="inline-flex my-auto w-10 h-10 cursor-pointer"
                    :is-rounded="true"
                    :is-border="false"
                    :src="rss3Profile.avatar"
                    :alt="rss3Profile.username"
                    @click="toPublicPage(rns, ethAddress)"
                />
            </div>
            <div class="nft-list grid gap-6 grid-cols-2 justify-items-center sm:grid-cols-3">
                <div class="relative w-full" v-for="item in nfts" :key="item.platform + item.identity + item.id">
                    <NFTItem
                        class="cursor-pointer"
                        size="auto"
                        :imageUrl="item.info.animation_url || item.info.image_preview_url"
                        :poster-url="item.info.image_preview_url"
                        @click="toSingleNFTPage(item.platform, item.identity, item.id, item.type)"
                    />
                    <NFTBadges
                        class="absolute right-2.5 top-2.5"
                        :chain="item.type.split('-')[0]"
                        location="overlay"
                        :collectionImg="item.info.collection_icon"
                    />
                </div>
            </div>
            <div
                class="fixed z-50 bottom-2 left-0 right-0 flex gap-5 m-auto px-4 py-4 w-full max-w-md bg-btn-container"
                v-if="isOwner"
            >
                <Button
                    size="lg"
                    class="m-auto text-nft-btn-m-text text-lg bg-nft-btn-m shadow-nft-btn-m"
                    @click="toSetupNfts"
                >
                    <span>Manage NFTs</span>
                </Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import ImgHolder from '@/components/Common/ImgHolder.vue';
import NFTItem from '@/components/NFT/NFTItem.vue';
import NFTBadges from '@/components/NFT/NFTBadges.vue';
import RSS3, { IRSS3 } from '@/common/rss3';
import RNSUtils from '@/common/rns';
import config from '@/config';
import { RSS3Asset } from 'rss3-next/types/rss3';
import { GeneralAsset, GeneralAssetWithTags } from '@/common/types';
import { debounce } from 'lodash';
import { getName } from '@/common/utils';

interface Profile {
    avatar: string;
    username: string;
    address: string;
    bio: string;
}

@Options({
    name: 'NFTs',
    components: { ImgHolder, Button, NFTItem, NFTBadges },
})
export default class NFTs extends Vue {
    rns: string = '';
    ethAddress: string = '';
    isOwner: boolean = false;
    nfts: GeneralAssetWithTags[] = [];
    rss3Profile: Profile = {
        avatar: config.defaultAvatar,
        username: '',
        address: '',
        bio: '',
    };
    $gtag: any;
    scrollTop: number = 0;
    lastRoute: string = '';

    async initLoad() {
        this.lastRoute = this.$route.fullPath;
        this.nfts = [];
        this.rss3Profile.avatar = config.defaultAvatar;

        await RSS3.reconnect();
        const rss3 = await RSS3.visitor();
        const owner: string = <string>rss3.account.address;
        await this.getAddress(owner);

        const profile = await rss3.profile.get(this.ethAddress);

        this.rss3Profile.avatar = profile.avatar?.[0] || config.defaultAvatar;
        this.rss3Profile.username = profile.name || '';

        // Setup theme
        const themes = RSS3.getAvailableThemes(await rss3.assets.get(this.ethAddress));
        if (themes[0]) {
            document.body.classList.add(themes[0].class);
        } else {
            document.body.classList.remove(...document.body.classList);
        }

        const nftData = await RSS3.getAssetProfile(this.ethAddress, 'NFT');

        if (nftData) {
            await this.loadNFTs(await rss3.assets.get(this.ethAddress), <GeneralAsset[]>nftData.assets);
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
            if (address.startsWith('0x')) {
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

    private getAssetOrder(nft: RSS3Asset) {
        let order = -1;
        nft.tags?.forEach((tag: string) => {
            if (tag.startsWith('pass:order:')) {
                order = parseInt(tag.substr(11));
            }
        });
        return order;
    }

    async loadNFTs(assetsInRSS3File: RSS3Asset[], assetsGrabbed: GeneralAsset[]) {
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

        const NFTList: GeneralAssetWithTags[] = [];

        for (const am of assetsMerge) {
            if (am.type.includes('NFT')) {
                NFTList.push(am);
            }
        }

        this.nfts = NFTList.filter((asset) => !asset.tags || asset.tags.indexOf('pass:hidden') === -1).sort(
            (a, b) => this.getAssetOrder(a) - this.getAssetOrder(b),
        );
    }

    toSingleNFTPage(platform: string, identity: string, id: string, type: string) {
        this.$gtag.event('visitSingleNft', {
            userid: this.rns || this.ethAddress,
            platform: platform,
            nftidentity: identity,
            nftid: id,
            nfttype: type,
        });
        this.$router.push(
            (config.subDomain.isSubDomainMode ? '' : `/${this.rns || this.ethAddress}`) +
                `/singlenft/${platform}/${identity}/${id}/${type}`,
        );
    }

    toPublicPage(rns: string, ethAddress: string) {
        if (rns && config.subDomain.isSubDomainMode) {
            this.$router.push('/');
        } else {
            this.$router.push(`/${rns || ethAddress}`);
        }
    }

    toSetupNfts() {
        this.$router.push(`/setup/nfts`);
    }

    back() {
        this.$router.push(config.subDomain.isSubDomainMode ? '/' : `/${this.rns || this.ethAddress}`);
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
