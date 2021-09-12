<template>
    <div class="h-screen bg-gitcoin-bg overflow-y-auto">
        <div class="main px-4 py-8 max-w-md m-auto">
            <div class="header flex justify-between items-center pb-4">
                <Button size="sm" class="w-10 h-10 bg-white text-primary shadow-secondary" @click="back">
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
                <div class="section-title text-2xl text-gitcoin-title font-bold text-center">Donations</div>
                <ImgHolder
                    class="w-10 h-10 inline-flex my-auto cursor-pointer"
                    :is-rounded="true"
                    :is-border="false"
                    :src="rss3Profile.avatar"
                    :alt="rss3Profile.username"
                    @click="toPublicPage(rns || ethAddress)"
                />
            </div>
            <div
                class="gitcoin-gitcoins flex flex-col gap-y-4"
                :class="{ 'pb-16': isOwner }"
                v-show="gitcoins.length !== 0"
            >
                <GitcoinTitle :grants="grants" :contributions="contribs"></GitcoinTitle>
                <GitcoinCard
                    v-for="(item, index) in gitcoins"
                    :key="index"
                    :imageUrl="item.info.image_preview_url"
                    :name="item.info.title"
                    :contrib="item.info.total_contribs"
                    :amount="item.info.token_contribs"
                    @click="toSingleGitcoin(item.platform, item.identity, item.id)"
                ></GitcoinCard>
            </div>
            <div class="px-4 py-4 flex gap-5 fixed bottom-2 left-0 right-0 max-w-md m-auto w-full" v-if="isOwner">
                <Button
                    size="lg"
                    class="m-auto text-lg bg-gitcoin-button text-white shadow-gitcoin"
                    @click="toSetupGitcoins"
                >
                    Manage Contribs
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
import axios from 'axios';
import config from '@/config';
import RNSUtils from '@/common/rns';
import RSS3 from '@/common/rss3';
import { data } from 'autoprefixer';
import { GeneralAsset, GeneralAssetWithTags } from '@/common/types';
import { RSS3Asset } from 'rss3-next/types/rss3';

interface Profile {
    avatar: string;
    username: string;
    address: string;
    bio: string;
}

@Options({
    components: { ImgHolder, Button, GitcoinTitle, GitcoinCard },
})
export default class Gitcoins extends Vue {
    rns: string = '';
    ethAddress: string = '';
    public grants: number = 0;
    public contribs: number = 0;
    public gitcoins: Array<Object> = [];
    public isOwner: boolean = false;
    public rss3Profile: Profile = {
        avatar: config.defaultAvatar,
        username: '',
        address: '',
        bio: '',
    };

    async mounted() {
        const address = <string>this.$route.params.address;
        if (!address.startsWith('0x')) {
            this.rns = address;
            this.ethAddress = (await RNSUtils.name2Addr(`${address}.pass3.me`)).toString();
        } else {
            this.ethAddress = address;
            this.rns = (await RNSUtils.addr2Name(address)).toString();
        }
        const rss3 = await RSS3.visitor();
        const owner: string = <string>rss3.account.address;

        if (owner === this.ethAddress) {
            this.isOwner = true;
        }

        const profile = await rss3.profile.get(this.ethAddress);
        this.rss3Profile.avatar = profile?.avatar?.[0] || config.defaultAvatar;
        this.rss3Profile.username = profile?.name?.[0] || '';
        this.rss3Profile.address = this.ethAddress;

        const data = await RSS3.getAssetProfile(this.ethAddress);
        if (data) {
            await this.loadGitcoin(await rss3.assets.get(this.ethAddress), data.assets);
        }
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

    async loadGitcoin(assetsInRSS3File: RSS3Asset[], assetsGrabbed: GeneralAsset[]) {
        const assetsMerge: GeneralAssetWithTags[] = await Promise.all(
            (assetsGrabbed || []).map(async (ag: GeneralAssetWithTags) => {
                const origType = ag.type;
                ag.type = 'Invalid'; // Using as a match mark
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
            if (am.type === 'Gitcoin-Donation' && !am.tags?.includes('pass:hidden')) {
                this.contribs += <number>am.info.total_contribs;
                GitcoinList.push(am);
            }
        }

        this.gitcoins = GitcoinList.sort((a, b) => this.getAssetOrder(a) - this.getAssetOrder(b));

        this.grants = this.gitcoins.length;
    }

    public toPublicPage(address: string) {
        this.$router.push(`/${address}`);
    }

    public back() {
        window.history.back();
    }

    public toSetupGitcoins() {
        this.$router.push(`/setup/gitcoins`);
    }

    public toGitcoin() {
        window.open(`https://gitcoin.co/`);
    }

    public toSingleGitcoin(platform: string, identity: string, id: string) {
        this.$router.push(`/${this.rns}/singlegitcoin/${platform}/${identity}/${id}`);
    }
}
</script>

<style></style>
