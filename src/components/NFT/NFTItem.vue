<template>
    <div
        :style="{
            width: size + 'px',
            height: size + 'px',
        }"
        class="rounded"
    >
        <video
            v-if="imageUrl?.endsWith('.mp4') || imageUrl?.endsWith('.mov') || imageUrl?.endsWith('.mp3')"
            :src="imageUrl"
            :poster="posterUrl?.endsWith('.mp4') || posterUrl?.endsWith('.mov') ? undefined : posterUrl"
            class="nft-item"
            :style="{
                width: size + 'px',
                height: size + 'px',
            }"
            :autoplay="isShowingDetails || posterUrl?.endsWith('.mp4') || posterUrl?.endsWith('.mov')"
            loop
            webkit-playsinline
            playsinline
            :controls="isShowingDetails"
        />
        <iframe
            v-else-if="imageUrl?.endsWith('embed') || imageUrl?.includes('farmhero.io')"
            :src="imageUrl"
            class="nft-item"
            :style="{
                width: size + 'px',
                height: size + 'px',
            }"
        />
        <model-viewer
            v-else-if="imageUrl?.endsWith('.glb') && isShowingDetails"
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
            :src="(imageUrl?.endsWith('.glb') ? posterUrl : imageUrl) || defaultImage"
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
import config from '@/config';

@Options({
    props: {
        size: Number,
        posterUrl: String, // This should be image URL
        imageUrl: String, // This should be detailed URL
        isShowingDetails: Boolean,
    },
    components: {
        viewer,
    },
})
export default class NFTItem extends Vue {
    size!: Number;
    imageUrl!: String;
    defaultImage: String = config.defaultAvatar;
}
</script>

<style scoped lang="postcss">
@layer components {
    .nft-item {
        @apply rounded border border-white filter drop-shadow-nft bg-white object-contain;
    }
}
</style>
