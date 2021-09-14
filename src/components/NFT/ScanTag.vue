<template>
    <div
        class="scan-tag"
        :class="{
            'bg-Etherscan': chain === 'Ethereum',
            'bg-Roninscan': chain === 'Ronin',
            'bg-bscscan': chain === 'BSC',
        }"
    ></div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

@Options({
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
        @apply rounded-sm border-sm border-nft-bg px-2 py-2 w-24 h-9 bg-nft-tag-bg bg-origin-content bg-contain bg-center bg-no-repeat text-center leading-none;
    }
}
</style>
