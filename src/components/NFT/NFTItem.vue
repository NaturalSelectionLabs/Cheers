<template>
    <video
        v-if="imageUrl?.endsWith('mp4') || imageUrl?.endsWith('mov')"
        :style="{
            width: size + 'px',
            height: size + 'px',
        }"
        :src="imageUrl"
        class="nft-item"
        autoplay
        loop
        muted
    />
    <model-viewer
        v-else-if="imageUrl?.endsWith('glb')"
        :style="{
            width: size + 'px',
            height: size + 'px',
        }"
        :src="imageUrl"
        class="nft-item"
        ar
        ar-modes="webxr scene-viewer quick-look"
        environment-image="neutral"
        auto-rotate
        camera-controls
    />
    <img
        v-else
        :style="{
            width: size + 'px',
            height: size + 'px',
        }"
        :src="imageUrl"
        class="nft-item"
    />
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import * as viewer from '@google/model-viewer';

@Options({
    props: {
        size: Number,
        imageUrl: String,
    },
    components: {
        viewer,
    },
})
export default class NFTItem extends Vue {
    size!: Number;
    imageUrl!: String;
}
</script>

<style scoped lang="postcss">
@layer components {
    .nft-item {
        @apply rounded border border-white filter drop-shadow-nft bg-white object-contain;
    }
}
</style>
