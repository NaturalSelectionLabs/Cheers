<template>
    <div class="details-container">
        <h2>{{ details.name }} #{{ details.token_id }}</h2>
        <div class="tag-container">
            <ScanTag
                :chain="chain"
                class="cursor-pointer"
                @click="toScan(details.asset_contract?.address, details.token_id)"
            />
            <MarketTag
                :market="market"
                class="cursor-pointer"
                @click="toMarket(details.asset_contract?.address, details.token_id)"
            />
        </div>
        <div v-if="details.description">
            <h3>Description</h3>
            <p>{{ details.description }}</p>
        </div>
        <div v-if="details.traits">
            <h3>Properties</h3>
            <div class="traits-container">
                <Trait
                    v-for="item in details.traits"
                    :key="item.trait_type + item.value"
                    :traitType="item.trait_type"
                    :traitValue="item.value"
                ></Trait>
            </div>
        </div>
        <div v-if="details.collection?.name">
            <h3>About {{ details.collection?.name }}</h3>
            <p>{{ details.collection?.description }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Trait from '@/components/NFT/Trait.vue';
import ScanTag from '@/components/NFT/ScanTag.vue';
import MarketTag from '@/components/NFT/MarketTag.vue';
@Options({
    components: { Trait, ScanTag, MarketTag },
    props: {
        details: Object,
        chain: String,
        market: String,
    },
})
export default class NFTDetail extends Vue {
    details!: Object;
    chain!: String;
    market!: String;

    public toMarket(address: string, tokenId: string) {
        switch (this.market) {
            case 'opensea':
                window.open(`https://opensea.io/assets/${address}/${tokenId}`);
                break;
            case 'rarible':
                window.open(`https://rarible.com/token/${address}:${tokenId}`);
                break;
        }
    }

    public toScan(address: string, tokenId: string) {
        switch (this.chain) {
            case 'BSC':
                window.open(`https://bscscan.com/token/${address}?a=${tokenId}`);
                break;
            case 'Ethereum':
                window.open(`https://etherscan.io/token/${address}?a=${tokenId}`);
                break;
        }
    }
}
</script>

<style scoped lang="postcss">
@layer components {
    .details-container {
        @apply w-full px-5 py-4 bg-body-bg rounded filter shadow-nft border-card text-body-text flex flex-col justify-start items-start gap-5;
    }
    h2 {
        @apply text-xl font-semibold capitalize overflow-ellipsis overflow-hidden break-all;
    }
    h3 {
        @apply text-lg font-medium capitalize;
    }
    p {
        @apply text-sm leading-normal break-all;
    }
    .tag-container {
        @apply flex flex-row flex-wrap justify-start items-center gap-2.5;
    }
    .traits-container {
        @apply flex flex-row flex-wrap justify-start items-center gap-2.5;
    }
}
</style>
