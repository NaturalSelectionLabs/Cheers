<template>
    <div class="market-tag">
        <Opensea v-if="market === 'opensea'" />
        <Rarible v-if="market === 'rarible'" />
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Opensea from '@/components/Icons/Opensea.vue';
import Rarible from '@/components/Icons/Rarible.vue';

@Options({
    components: { Opensea, Rarible },
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
        @apply rounded-sm border-sm border-nft-bg px-2 py-1.5 flex justify-center items-center bg-nft-tag-bg bg-origin-content bg-contain bg-center bg-no-repeat text-center leading-none;
    }
}
</style>
