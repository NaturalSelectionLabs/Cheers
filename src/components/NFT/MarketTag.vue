<template>
    <div
        class="
            flex
            items-center
            justify-center
            px-2
            py-1.5
            text-center
            leading-none
            bg-white bg-contain bg-center bg-no-repeat
            border-sm border-nft-bg
            rounded-sm
            bg-origin-content
        "
    >
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

<style scoped lang="postcss"></style>
