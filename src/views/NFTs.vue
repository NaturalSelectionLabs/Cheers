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
                        :imageUrl="item.nft.image_url"
                        @click="toSinglenftPage(item.account, item.index)"
                    />
                    <NFTBadges
                        class="absolute top-2.5 right-2.5"
                        :chain="item.nft.chain"
                        location="overlay"
                        :collectionImg="item.nft.collection.image_url"
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
import RSS3, { defaultAvatar } from '@/common/rss3';
import RNSUtils from '@/common/rns';

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
        avatar: defaultAvatar,
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
            this.rss3Profile.avatar = data.rss3File.profile?.avatar?.[0] || defaultAvatar;
            this.rss3Profile.username = data.rss3File.profile?.name?.[0] || '';
            this.rss3Profile.address = address;

            data.assets.ethereum.forEach((item: { nft: any[] }, aid: any) => {
                item.nft.forEach((nft, i) => {
                    this.nftList.push({
                        account: aid,
                        index: i,
                        nft: nft,
                    });
                });
            });
        }
    }
    public toSinglenftPage(account: string, index: number) {
        this.$gtag.event('visitSingleNft', { userid: this.rns || this.ethAddress, nftid: account, nftindex: index });
        this.$router.push(`/${this.rns || this.ethAddress}/singlenft/${account}/${index}`);
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
