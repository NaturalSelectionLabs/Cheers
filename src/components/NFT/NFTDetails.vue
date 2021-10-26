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
            <div v-html="getMarkdown(details.description)"></div>
        </div>
        <div v-if="details.traits && details.traits.length > 0">
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
        <div v-if="details.collection?.description">
            <h3>About {{ details.collection?.name }}</h3>
            <div v-html="getMarkdown(details.collection?.description)"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Trait from '@/components/NFT/Trait.vue';
import ScanTag from '@/components/NFT/ScanTag.vue';
import MarketTag from '@/components/NFT/MarketTag.vue';
import marked from 'marked';

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

    public getMarkdown(description: string): string {
        return marked(description);
    }
}
</script>

<style scoped lang="postcss">
@layer components {
    .details-container {
        @apply flex flex-col gap-5 items-start justify-start px-5 py-4 w-full text-body-text border-card rounded filter;
    }
    h2 {
        @apply break-all text-xl font-semibold overflow-hidden capitalize overflow-ellipsis;
    }
    h3 {
        @apply text-lg font-medium capitalize;
    }
    p {
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
        -ms-hyphens: auto;
        -moz-hyphens: auto;
        -webkit-hyphens: auto;
        hyphens: auto;
        @apply text-sm leading-normal;
    }
    .tag-container {
        @apply flex flex-row flex-wrap gap-2.5 items-center justify-start;
    }
    .traits-container {
        @apply flex flex-row flex-wrap gap-2.5 items-center justify-start;
    }
}
</style>
