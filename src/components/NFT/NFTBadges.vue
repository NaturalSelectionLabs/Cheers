<template>
    <div class="badges-container">
        <div
            v-if="collectionImg !== null"
            class="badge"
            :class="{
                'badge-overlay': location === 'overlay',
                'badge-header': location === 'header',
            }"
            :style="{ backgroundImage: `url(${collectionImg})` }"
        ></div>
        <div
            class="badge bg-white"
            :class="{
                'bg-BSC': chain === 'BSC',
                'bg-Ethereum': chain === 'Ethereum',
                'bg-Ronin': chain === 'Ronin',
                'badge-overlay': location === 'overlay',
                'badge-header': location === 'header',
            }"
        ></div>
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
        @apply flex flex-row gap-1 justify-end items-center;
    }

    .badge {
        @apply rounded-full border-sm border-white filter drop-shadow-nft bg-85 bg-center bg-no-repeat bg-white;
    }
    .badge-overlay {
        @apply w-6 h-6;
    }
    .badge-header {
        @apply w-8 h-8;
    }
}
</style>
