<template>
    <div
        class="flex items-center justify-center rounded-sm bg-white bg-contain bg-center bg-no-repeat bg-origin-content px-2 py-1.5 text-center leading-none"
    >
        <Etherscan v-if="chain === 'Ethereum'" />
        <Bscscan v-if="chain === 'BSC'" />
        <PolygonScan v-if="chain === 'Polygon'" />
        <ArbiScan v-if="chain === 'Arbitrum'" />
        <AvaxScan v-if="chain === 'AVAX'" />
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Etherscan from '@/components/Icons/Etherscan.vue';
import Bscscan from '@/components/Icons/Bscscan.vue';
import PolygonScan from '@/components/Icons/PolygonScan.vue';
import ArbiScan from '@/components/Icons/ArbiScan.vue';
import AvaxScan from '@/components/Icons/AvaxScan.vue';

@Options({
    components: { ArbiScan, PolygonScan, Etherscan, Bscscan, AvaxScan },
    props: {
        chain: String,
    },
})
export default class ScanTag extends Vue {
    chain!: String;
}
</script>

<style></style>
