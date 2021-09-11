<template>
    <div class="h-screen bg-nft-bg overflow-y-auto">
        <div class="main px-4 py-8 max-w-md m-auto">
            <div class="header flex justify-between items-center pb-4">
                <Button size="sm" class="w-10 h-10 bg-white text-primary shadow-secondary" @click="back">
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
                <div class="section-title text-2xl text-nft-title font-bold text-center">NFTs</div>
                <ImgHolder
                    class="w-10 h-10 inline-flex my-auto cursor-pointer"
                    :is-rounded="true"
                    :is-border="false"
                    :src="this.rss3Profile.avatar"
                    :alt="this.rss3Profile.username"
                    @click="toPublicPage(this.rss3Profile.address)"
                />
            </div>
            <div class="nft-list flex flex-wrap justify-between items-center gap-y-4">
                <div class="relative" v-for="(item, index) in nfts" :key="index">
                    <NFTItem
                        class="cursor-pointer"
                        :size="NFTWidth > 200 ? 200 : NFTWidth"
                        :imageUrl="item.info.animation_url || item.info.image_preview_url"
                        :poster-url="item.info.image_preview_url"
                        @click="toSingleNFTPage(item.platform, item.identity, item.id)"
                    />
                    <NFTBadges
                        class="absolute top-2.5 right-2.5"
                        :chain="item.platform"
                        location="overlay"
                        :collectionImg="item.info.collection_icon"
                    />
                </div>
            </div>
            <div class="px-4 py-4 flex gap-5 fixed bottom-0 left-0 right-0 max-w-md m-auto w-full z-50" v-if="isOwner">
                <Button size="lg" class="m-auto text-lg bg-nft-button text-white shadow-nft" @click="toSetupNfts">
                    Manage NFTs
                </Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import ImgHolder from '@/components/ImgHolder.vue';
import NFTItem from '@/components/NFT/NFTItem.vue';
import NFTBadges from '@/components/NFT/NFTBadges.vue';
import RSS3 from '@/common/rss3';
import RNSUtils from '@/common/rns';
import config from '@/config';
import { RSS3Asset } from 'rss3-next/types/rss3';
import { GeneralAsset, GeneralAssetWithTags } from '@/common/types';

interface Profile {
    avatar: string;
    username: string;
    address: string;
    bio: string;
}

@Options({
    components: { ImgHolder, Button, NFTItem, NFTBadges },
})
export default class NFTs extends Vue {
    rns: string = '';
    ethAddress: string = '';
    public NFTWidth: number = (window.innerWidth - 52) / 2;
    public isOwner: boolean = false;
    nfts: GeneralAssetWithTags[] = [];
    public rss3Profile: Profile = {
        avatar: config.defaultAvatar,
        username: '',
        address: '',
        bio: '',
    };
    $gtag: any;

    async mounted() {
        const address = <string>this.$route.params.address;
        if (!address.startsWith('0x')) {
            this.rns = address;
            this.ethAddress = (await RNSUtils.name2Addr(`${address}.pass3.me`)).toString();
        } else {
            this.ethAddress = address;
            this.rns = (await RNSUtils.addr2Name(address)).replace('.pass3.me', '');
        }
        const rss3 = await RSS3.visitor();
        const owner: string = <string>rss3.account.address;
        // const owner: string = 'RSS3 Address';

        if (owner === this.ethAddress) {
            this.isOwner = true;
        }

        const profile = await rss3.profile.get(this.ethAddress);

        this.rss3Profile.avatar = profile.avatar?.[0] || config.defaultAvatar;
        this.rss3Profile.username = profile.name?.[0] || '';

        const data = await RSS3.getAssetProfile(this.ethAddress);

        if (data) {
            await this.loadNFTs(await rss3.assets.get(this.ethAddress), <GeneralAsset[]>data.assets);
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

    async loadNFTs(assetsInRSS3File: RSS3Asset[], assetsGrabbed: GeneralAsset[]) {
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

        const NFTList: GeneralAssetWithTags[] = [];

        for (const am of assetsMerge) {
            if (am.type === 'NFT') {
                NFTList.push(am);
            }
        }

        this.nfts = NFTList.filter((asset) => !asset.tags || asset.tags.indexOf('pass:hidden') === -1).sort(
            (a, b) => this.getAssetOrder(a) - this.getAssetOrder(b),
        );
    }

    public toSingleNFTPage(platform: string, identity: string, id: string) {
        this.$gtag.event('visitSingleNft', {
            userid: this.rns || this.ethAddress,
            platform: platform,
            nftidentity: identity,
            nftid: id,
        });
        this.$router.push(`/${this.rns || this.ethAddress}/singlenft/${platform}/${identity}/${id}`);
    }

    public toPublicPage(address: string) {
        this.$router.push(`/${address}`);
    }

    public toSetupNfts() {
        this.$router.push(`/setup/nfts`);
    }

    public back() {
        window.history.back();
    }
}
</script>

<style></style>
