<template>
    <div class="scan-tag">
        <Etherscan v-if="chain === 'Ethereum'" />
        <Bscscan v-if="chain === 'BSC'" />
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Etherscan from '@/components/Icons/Etherscan.vue';
import Bscscan from '@/components/Icons/Bscscan.vue';

@Options({
    components: { Etherscan, Bscscan },
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
        @apply rounded-sm border-sm border-nft-bg px-2 py-1.5 flex justify-center items-center bg-white bg-origin-content bg-contain bg-center bg-no-repeat text-center leading-none shadow-nft;
    }
}
</style>
