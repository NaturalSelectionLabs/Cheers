<template>
    <div
        class="market-tag"
        :class="{
            'bg-opensea': market === 'opensea',
            'bg-rarible': market === 'rarible',
        }"
    ></div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

@Options({
    props: {
        market: String,
    },
})
export default class MarketTag extends Vue {
    market!: String;
}
</script>

<style scoped lang="postcss">
@layer components {
    .market-tag {
        @apply rounded-sm border-sm border-nft-bg px-2 py-2 w-24 h-9 bg-origin-content bg-contain bg-center bg-no-repeat text-center leading-none;
    }
}
</style>
