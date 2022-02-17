<template>
    <div
        class="flex w-full flex-col items-start justify-start gap-5 rounded border-card px-5 py-4 text-body-text filter"
    >
        <h2 class="overflow-hidden text-ellipsis break-all text-xl font-semibold capitalize">
            {{ details.name }} #{{ details.token_id }}
        </h2>
        <div class="flex flex-row flex-wrap items-center justify-start gap-2.5">
            <ScanTag
                :chain="chain"
                class="cursor-pointer"
                @click="toScan(details.asset_contract?.address, details.token_id)"
            />
            <MarketTag
                v-if="market"
                :market="market"
                class="cursor-pointer"
                @click="toMarket(details.asset_contract?.address, details.token_id)"
            />
        </div>
        <div v-if="details.description">
            <h3 class="text-lg font-medium capitalize text-primary-text">Description</h3>
            <div v-html="getMarkdown(details.description)"></div>
        </div>
        <div v-if="details.traits && details.traits.length > 0">
            <h3 class="text-lg font-medium capitalize text-primary-text">Properties</h3>
            <div class="mt-2 flex flex-row flex-wrap items-center justify-start gap-2.5">
                <Trait
                    v-for="item in details.traits"
                    :key="item.trait_type + item.value"
                    :traitType="item.trait_type"
                    :traitValue="item.value"
                />
            </div>
        </div>
        <div v-if="details.collection?.description">
            <h3 class="text-lg font-medium capitalize text-primary-text">About {{ details.collection?.name }}</h3>
            <div v-html="getMarkdown(details.collection?.description)"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Trait from '@/components/NFT/Trait.vue';
import ScanTag from '@/components/NFT/ScanTag.vue';
import MarketTag from '@/components/NFT/MarketTag.vue';
import { marked } from 'marked';

@Options({
    components: { Trait, ScanTag, MarketTag },
    props: {
        details: Object,
        chain: String,
    },
})
export default class NFTDetail extends Vue {
    details!: Object;
    chain!: String;

    get market(): string {
        switch (this.chain) {
            case 'Ethereum':
            case 'Polygon':
                return 'opensea';
            default:
                return '';
        }
    }

    toMarket(address: string, tokenId: string) {
        switch (this.market) {
            case 'opensea':
                switch (this.chain) {
                    case 'Polygon':
                        window.open(`https://opensea.io/assets/matic/${address}/${tokenId}`);
                        break;
                    case 'Ethereum':
                        window.open(`https://opensea.io/assets/${address}/${tokenId}`);
                        break;
                }
                break;
            case 'rarible':
                window.open(`https://rarible.com/token/${address}:${tokenId}`);
                break;
        }
    }

    toScan(address: string, tokenId: string) {
        switch (this.chain) {
            case 'BSC':
                window.open(`https://bscscan.com/token/${address}?a=${tokenId}`);
                break;
            case 'Ethereum':
                window.open(`https://etherscan.io/token/${address}?a=${tokenId}`);
                break;
            case 'Polygon':
                window.open(`https://polygonscan.com/token/${address}?a=${tokenId}`);
                break;
            case 'Arbitrum':
                window.open(`https://arbiscan.io/token/${address}?a=${tokenId}`);
                break;
            case 'AVAX':
                window.open(`https://snowtrace.io/token/${address}?a=${tokenId}`);
                break;
        }
    }

    getMarkdown(description: string): string {
        return marked(description);
    }
}
</script>

<style scoped lang="postcss">
p {
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
    -ms-hyphens: auto;
    -moz-hyphens: auto;
    -webkit-hyphens: auto;
    hyphens: auto;

    /* text-sm */
    font-size: 0.875rem;

    /* leading-normal */
    line-height: 1.5;
}
</style>
