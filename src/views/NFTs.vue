<template>
    <div class="h-screen bg-nft-bg overflow-y-auto">
        <div class="main px-4 py-8 max-w-md m-auto">
            <div class="header flex justify-between items-center pb-4">
                <Button size="sm" class="w-10 h-10 bg-white text-primary shadow-secondary" @click="back">
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
                <div class="section-title text-2xl text-nft-title font-bold text-center">NFTs</div>
                <ImgHolder
                    class="w-10 h-10 inline-flex my-auto"
                    :is-rounded="true"
                    :is-border="false"
                    :src="this.avatar"
                    :alt="this.username"
                />
            </div>
            <div class="nft-list flex flex-wrap justify-between items-center gap-y-4">
                <div class="relative" v-for="(item, index) in nftList" :key="index">
                    <NFTItem
                        :size="NFTWidth > 200 ? 200 : NFTWidth"
                        :imageUrl="item.nft.image_url"
                        @click="toSinglenftPage(item.account, index)"
                    />
                    <NFTBadges
                        class="absolute z-50 top-2.5 right-2.5"
                        :chain="item.nft.chain"
                        location="overlay"
                        :collectionImg="item.nft.collection.image_url"
                    />
                </div>
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
import axios from 'axios';

@Options({
    components: { ImgHolder, Button, NFTItem, NFTBadges },
})
export default class NFTs extends Vue {
    public NFTWidth: number = (window.innerWidth - 52) / 2;
    public nftList: Array<Object> = [];
    public avatar: String = '';
    public username: String = '';

    async mounted() {
        const res = await axios.get(
            `https://rss3-asset-hub-g886a.ondigitalocean.app/asset-profile/${this.$route.params.address}`,
        );

        if (res.data) {
            this.avatar = res.data.rss3File.profile?.avatar?.[0];
            this.username = res.data.rss3File.profile?.name?.[0];

            res.data.assets.ethereum.forEach((item: { nft: any[] }, aid: any) => {
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
        const address = <string>this.$route.params.address;
        this.$router.push(`/${address}/singlenft/${account}/${index}`);
    }
    public back() {
        window.history.back();
    }
}
</script>

<style></style>
