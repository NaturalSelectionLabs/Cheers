<template>
    <div class="h-screen bg-nft-bg overflow-y-auto">
        <div class="main px-4 py-8 max-w-md m-auto">
            <div class="header flex justify-between items-start pb-4 relative">
                <Button size="sm" class="w-10 h-10 mr-10 bg-white text-primary shadow-secondary" @click="back">
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
                <div class="section-title text-2xl text-nft-title font-bold text-center">
                    {{ details.collection.name + ' NFT' }}
                </div>
                <div class="w-10 h-10 ml-10">
                    <NFTBadges
                        class="absolute z-50 right-0"
                        chain="Ethereum"
                        location="header"
                        :collectionImg="details.collection.image_url"
                    />
                </div>
            </div>
            <div class="content">
                <div class="image pb-4">
                    <NFTItem :imageUrl="this.details.image_url" :size="NFTWidth > 416 ? 416 : NFTWidth"></NFTItem>
                </div>
                <NFTDetail :chain="details.chain" :details="details" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import NFTItem from '@/components/NFT/NFTItem.vue';
import NFTDetail from '@/components/NFT/NFTDetails.vue';
import AccountItem from '@/components/AccountItem.vue';
import NFTBadges from '@/components/NFT/NFTBadges.vue';
import RSS3 from '@/common/rss3';

@Options({
    components: { Button, NFTDetail, NFTItem, AccountItem, NFTBadges },
})
export default class SingleNFT extends Vue {
    public NFTWidth: number = window.innerWidth - 32;
    public details?: Object = {
        collection: {
            name: '',
            image_url: '',
        },
    };

    async mounted() {
        const address: string = <string>this.$route.params.address;
        const aid: number = Number(this.$route.params.aid);
        const id: number = Number(this.$route.params.id);
        const data = await RSS3.getAssetProfile(address);

        if (data) {
            this.details = data.assets.ethereum[aid].nft[id];
        }
    }
    public back() {
        window.history.back();
    }
}
</script>

<style></style>
