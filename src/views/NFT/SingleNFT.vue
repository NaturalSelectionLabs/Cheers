<template>
    <div class="m-auto pb-20 pt-8 px-4 max-w-screen-lg">
        <Header />
        <TransBarCard :title="details.name" :haveDetails="true" :haveContent="false" :haveContentInfo="false">
            <template #header>
                <NFTBadges :chain="details.chain" location="header" :collectionImg="details.collection?.image_url" />
            </template>
            <template #details>
                <div class="flex flex-col gap-4 m-auto py-4 w-full max-w-screen-sm md:py-8">
                    <NFTItem
                        :imageUrl="details.animation_url || details.image_url"
                        :poster-url="details.image_url"
                        size="contain"
                        :is-showing-details="true"
                    />
                    <NFTDetail :chain="details.chain.split('.')[0]" :details="details" />
                </div>
            </template>
        </TransBarCard>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import NFTItem from '@/components/NFT/NFTItem.vue';
import NFTDetail from '@/components/NFT/NFTDetails.vue';
import NFTBadges from '@/components/NFT/NFTBadges.vue';
import RSS3 from '@/common/rss3';
import { NFT, NFTResponse } from '@/common/types';
import config from '@/config';
import utils from '@/common/utils';
import TransBarCard from '@/components/Card/TransBarCard.vue';
import Header from '@/components/Common/Header.vue';

@Options({
    name: 'SingleNFT',
    components: { NFTDetail, NFTItem, NFTBadges, TransBarCard, Header },
})
export default class SingleNFT extends Vue {
    details: NFT = {
        chain: 'Ethereum.NFT',
        token_id: '',
        asset_contract: {
            address: '',
        },
    };

    async mounted() {
        const addrOrName = utils.getAddress(<string>this.$route.params.address);
        const pageOwner = await RSS3.setPageOwner(addrOrName);

        utils.subDomainModeRedirect(pageOwner.name);

        const platform: string = String(this.$route.params.platform);
        const identity: string = String(this.$route.params.identity);
        const id: string = String(this.$route.params.id);
        const type: string = String(this.$route.params.type);

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
}
</script>

<style></style>
