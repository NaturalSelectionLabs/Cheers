<template>
    <div class="flex flex-row items-center justify-end gap-1">
        <div
            v-if="collectionImg"
            class="rounded-full border-sm border-item-border bg-item-bg bg-cover bg-center bg-no-repeat"
            :class="{
                'h-6 w-6': location === 'overlay',
                'h-7 w-7': location === 'header',
            }"
            :style="{ backgroundImage: `url(${collectionImg})` }"
        />
        <div
            class="rounded-full border-sm border-item-border bg-item-bg bg-white bg-cover bg-center bg-no-repeat"
            :class="{
                'bg-BSC': chain === 'BSC.NFT',
                'bg-Ethereum': chain === 'Ethereum.NFT',
                'bg-Polygon': chain === 'Polygon.NFT',
                'bg-Arbitrum': chain === 'Arbitrum.NFT',
                'bg-Avalanche': chain === 'AVAX.NFT',
                'bg-Ronin': chain === 'Ronin.NFT',
                'h-6 w-6': location === 'overlay',
                'h-7 w-7': location === 'header',
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

<style></style>
