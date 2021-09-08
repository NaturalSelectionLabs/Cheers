<template>
    <div
        :style="{
            width: size + 'px',
            height: size + 'px',
        }"
    >
        <video
            v-if="imageUrl?.endsWith('mp4') || imageUrl?.endsWith('mov')"
            :src="imageUrl"
            class="nft-item"
            :style="{
                width: size + 'px',
                height: size + 'px',
            }"
            autoplay
            loop
            muted
            webkit-playsinline
            playsinline
        />
        <model-viewer
            v-else-if="imageUrl?.endsWith('glb')"
            :src="imageUrl"
            class="nft-item"
            :style="{
                width: size + 'px',
                height: size + 'px',
            }"
            ar
            ar-modes="webxr scene-viewer quick-look"
            environment-image="neutral"
            auto-rotate
            camera-controls
        />
        <img
            v-else
            :src="imageUrl"
            class="nft-item"
            :style="{
                width: size + 'px',
                height: size + 'px',
            }"
        />
    </div>
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
