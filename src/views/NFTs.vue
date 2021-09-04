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
                <div class="relative" v-for="(item, index) in nftList" :key="index">
                    <NFTItem
                        class="cursor-pointer"
                        :size="NFTWidth > 200 ? 200 : NFTWidth"
                        :imageUrl="item.info.image_url"
                        @click="toSinglenftPage(item.info.account, item.info.index)"
                    />
                    <NFTBadges
                        class="absolute top-2.5 right-2.5"
                        :chain="item.info.chain"
                        location="overlay"
                        :collectionImg="item.info.collection.image_url"
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
import { RSS3AssetWithInfo } from '@/common/types';

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
    public nftList: Array<Object> = [];
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
            this.rns = (await RNSUtils.addr2Name(address)).toString();
        }
        const rss3 = await RSS3.visitor();
        const owner: string = <string>rss3.account.address;
        // const owner: string = 'RSS3 Address';

        if (owner === this.ethAddress) {
            this.isOwner = true;
        }

        const data = await RSS3.getAssetProfile(this.ethAddress);
        if (!data) {
            return;
        }

        if (data) {
            this.rss3Profile.avatar = data.rss3File.profile?.avatar?.[0] || config.defaultAvatar;
            this.rss3Profile.username = data.rss3File.profile?.name?.[0] || '';
            this.rss3Profile.address = address;

            const NFTList: Array<RSS3Asset> = await Promise.all(
                (JSON.parse(JSON.stringify(await rss3.assets.get())) || []).map(async (nft: RSS3AssetWithInfo) => {
                    const info = await this.getInfo(nft);
                    if (info) {
                        nft.info = info;
                    }
                    return nft;
                }),
            );

            this.nftList = NFTList.filter((nft) => !nft.tags || nft.tags.indexOf('pass:hidden') === -1).sort(
                (a, b) => this.getNFTOrder(a) - this.getNFTOrder(b),
            );
        }
    }

    private async getInfo(nft: RSS3Asset) {
        const data = await RSS3.getAssetProfile(this.ethAddress);
        const assets = data?.assets;
        for (let chain in assets) {
            for (let i = 0; i < assets[chain].length; i++) {
                const chainInfo = assets[chain][i];
                for (let j = 0; j < chainInfo.nft.length; j++) {
                    const nftInfo = chainInfo.nft[j];
                    if (
                        nftInfo.chain === nft.platform &&
                        nftInfo.token_id === nft.id &&
                        nftInfo.asset_contract.address === nft.identity
                    ) {
                        let res: any = nftInfo;
                        res.account = i;
                        res.index = j;
                        return res;
                    }
                }
            }
        }
        return null;
    }

    private getNFTOrder(nft: RSS3Asset) {
        let order = -1;
        nft.tags?.forEach((tag: string) => {
            if (tag.startsWith('pass:order:')) {
                order = parseInt(tag.substr(11));
            }
        });
        return order;
    }

    public toSinglenftPage(account: string, index: number) {
        this.$gtag.event('visitSingleNft', { userid: this.rns || this.ethAddress, nftid: account, nftindex: index });
        let RNSAddress = this.rns.substring(0, this.rns.length - 9);
        this.$router.push(`/${RNSAddress || this.ethAddress}/singlenft/${account}/${index}`);
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
