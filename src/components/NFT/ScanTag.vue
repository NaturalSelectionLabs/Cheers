<template>
    <div class="scan-tag">
        <Etherscan v-if="chain === 'Ethereum.NFT'" />
        <Bscscan v-if="chain === 'BSC.NFT'" />
        <PolygonScan v-if="chain === 'Polygon.NFT'" />
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Etherscan from '@/components/Icons/Etherscan.vue';
import Bscscan from '@/components/Icons/Bscscan.vue';
import PolygonScan from '@/components/Icons/PolygonScan.vue';

@Options({
    components: { PolygonScan, Etherscan, Bscscan },
    props: {
        chain: String,
    },
})
export default class ScanTag extends Vue {
    chain!: String;
}
</script>

<style scoped lang="postcss">
@layer components {
    .scan-tag {
        @apply flex items-center justify-center px-2 py-1.5 text-center leading-none bg-white bg-contain bg-center bg-no-repeat border-sm border-nft-bg rounded-sm bg-origin-content;
    }
}
</style>
