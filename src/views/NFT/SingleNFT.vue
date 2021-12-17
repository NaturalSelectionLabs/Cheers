<template>
    <div class="h-screen bg-nft-bg overflow-y-auto">
        <div class="m-auto pb-20 pt-8 px-4 max-w-screen-lg">
            <div class="relative pb-4">
                <div
                    class="
                        absolute
                        z-0
                        top-0
                        flex
                        items-center
                        justify-center
                        px-16
                        w-full
                        h-10
                        text-center text-nft-title text-xl
                        font-bold
                    "
                >
                    {{ details.collection?.name }}
                </div>
                <div class="flex items-center justify-between">
                    <Button
                        size="sm"
                        class="w-10 h-10 text-secondary-btn-text bg-secondary-btn shadow-secondary-btn"
                        @click="back"
                    >
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
            <section class="m-auto max-w-screen-sm">
                <div class="image pb-4">
                    <NFTItem
                        :imageUrl="details.animation_url || details.image_url"
                        :poster-url="details.image_url"
                        size="contain"
                        :is-showing-details="true"
                    />
                </div>
                <NFTDetail :chain="details.chain" :details="details" :market="market" />
            </section>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import NFTItem from '@/components/NFT/NFTItem.vue';
import NFTDetail from '@/components/NFT/NFTDetails.vue';
import NFTBadges from '@/components/NFT/NFTBadges.vue';
import RSS3 from '@/common/rss3';
import { NFT, NFTResponse } from '@/common/types';
import config from '@/config';
import utils from '@/common/utils';
import setupTheme from '@/common/theme';

@Options({
    name: 'SingleNFT',
    components: { Button, NFTDetail, NFTItem, NFTBadges },
})
export default class SingleNFT extends Vue {
    rns: string = '';
    ethAddress: string = '';
    private details: NFT = {
        chain: 'Ethereum.NFT',
        token_id: '',
        asset_contract: {
            address: '',
        },
    };
    private market: string = 'opensea';

    async mounted() {
        const addrOrName = utils.getAddress(<string>this.$route.params.address);
        const pageOwner = await RSS3.setPageOwner(addrOrName);
        this.ethAddress = pageOwner.address;
        this.rns = pageOwner.name;

        const platform: string = String(this.$route.params.platform);
        const identity: string = String(this.$route.params.identity);
        const id: string = String(this.$route.params.id);
        const type: string = String(this.$route.params.type);
        // const id: string = String(this.$route.params.id);

        // Setup theme
        setupTheme((await pageOwner.persona?.assets.auto.getList(pageOwner.address)) || []);

        // const nftData = (await pageOwner.assets?.getDetails({
        //       assets: [id],
        //       full: true,
        //   })) as unknown as NFTResponse;
        const nftData = (await utils.loadAssets([
            {
                platform: platform,
                identity: identity,
                type: type,
                uniqueID: id,
            },
        ])) as unknown as NFTResponse;

        this.details = nftData?.[0].detail;
    }

    back() {
        if (window.history.state.back) {
            window.history.back();
        } else {
            this.$router.push((config.subDomain.isSubDomainMode ? '' : `/${this.rns || this.ethAddress}`) + `/nfts`);
        }
    }
}
</script>

<style></style>
