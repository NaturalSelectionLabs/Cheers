<template>
    <div class="badges-container">
        <div
            v-if="collectionImg"
            class="badge"
            :class="{
                'badge-overlay': location === 'overlay',
                'badge-header': location === 'header',
            }"
            :style="{ backgroundImage: `url(${collectionImg})` }"
        />
        <div
            class="badge bg-white"
            :class="{
                'bg-BSC': chain === 'BSC.NFT',
                'bg-Ethereum': chain === 'Ethereum.NFT',
                'bg-Polygon': chain === 'Polygon.NFT',
                'bg-Arbitrum': chain === 'Arbitrum.NFT',
                'bg-Avalanche': chain === 'AVAX.NFT',
                'bg-Ronin': chain === 'Ronin.NFT',
                'badge-overlay': location === 'overlay',
                'badge-header': location === 'header',
            }"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

@Options({
    props: {
        location: String, // 'overlay' or 'header'
        chain: String,
        collectionImg: String,
    },
})
export default class NFTBadges extends Vue {
    location!: String;
    chain!: String;
    collectionImg!: String;
}
</script>

<style scoped lang="postcss">
@layer components {
    .badges-container {
        @apply flex flex-row gap-1 items-center justify-end;
    }

    .badge {
        @apply bg-item-bg bg-cover bg-center bg-no-repeat border-sm border-item-border rounded-full;
    }
    .badge-overlay {
        @apply w-6 h-6;
    }
    .badge-header {
        @apply w-7 h-7;
    }
}
</style>
