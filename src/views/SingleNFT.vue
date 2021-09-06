<template>
    <div class="h-screen bg-nft-bg overflow-y-auto">
        <div class="main px-4 py-8 max-w-md m-auto">
            <div class="header pb-4 relative">
                <div
                    class="
                        section-title
                        text-xl text-nft-title
                        font-bold
                        text-center
                        w-full
                        h-10
                        absolute
                        z-0
                        top-0
                        px-16
                        flex
                        justify-center
                        items-center
                    "
                >
                    {{ details.collection?.name }}
                </div>
                <div class="flex justify-between items-center">
                    <Button size="sm" class="w-10 h-10 bg-white text-primary shadow-secondary" @click="back">
                        <i class="bx bx-chevron-left bx-sm"></i>
                    </Button>
                    <NFTBadges
                        class="absolute z-50 right-0"
                        :chain="details.chain"
                        location="header"
                        :collectionImg="details.collection?.image_url"
                    />
                </div>
            </div>
            <div class="content">
                <div class="image pb-4">
                    <NFTItem :imageUrl="this.details.image_url" :size="NFTWidth > 416 ? 416 : NFTWidth"></NFTItem>
                </div>
                <NFTDetail :chain="details.chain" :details="details" market="opensea" />
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
import RNSUtils from '@/common/rns';

@Options({
    components: { Button, NFTDetail, NFTItem, AccountItem, NFTBadges },
})
export default class SingleNFT extends Vue {
    rns: string = '';
    ethAddress: string = '';
    public NFTWidth: number = window.innerWidth - 32;
    public details?: Object = {
        collection: {
            name: '',
            image_url: '',
        },
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

        const chain: string = String(this.$route.params.chain);
        const aid: number = Number(this.$route.params.aid);
        const id: number = Number(this.$route.params.id);
        const data = await RSS3.getAssetProfile(this.ethAddress);

        if (data) {
            this.details = data.assets[chain][aid].nft[id];
        }
    }
    public back() {
        window.history.back();
    }
}
</script>

<style></style>
