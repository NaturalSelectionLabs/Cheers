<template>
    <div
        :style="{
            width: size + 'px',
            height: size + 'px',
        }"
        class="shadow-nft"
        :class="size < 60 ? 'rounded-sm' : 'rounded'"
    >
        <video
            v-if="
                imageUrl?.endsWith('.mp4') ||
                imageUrl?.endsWith('.mov') ||
                imageUrl?.endsWith('.webm') ||
                imageUrl?.endsWith('.mp3')
            "
            :src="imageUrl"
            :poster="
                posterUrl?.endsWith('.mp4') || posterUrl?.endsWith('.mov') || posterUrl?.endsWith('.webm')
                    ? undefined
                    : posterUrl
            "
            class="nft-item"
            :class="[!isShowingDetails ? 'object-cover' : 'object-contain', size < 60 ? 'rounded-sm' : 'rounded']"
            :style="{
                width: size + 'px',
                height: size + 'px',
            }"
            :autoplay="isShowingDetails || posterUrl?.endsWith('.mp4') || posterUrl?.endsWith('.mov')"
            loop
            webkit-playsinline
            playsinline
            muted
            :controls="isShowingDetails"
        />
        <iframe
            v-else-if="
                (imageUrl?.endsWith('embed') ||
                    imageUrl?.includes('farmhero.io') ||
                    imageUrl?.includes('0xAdventures.com') ||
                    imageUrl?.includes('crudefingers.com') ||
                    imageUrl?.includes('artblocks.io') ||
                    imageUrl?.endsWith('.html')) &&
                isShowingDetails
            "
            :src="imageUrl"
            class="nft-item"
            :class="[!isShowingDetails ? 'object-cover' : 'object-contain', size < 60 ? 'rounded-sm' : 'rounded']"
            :style="{
                width: size + 'px',
                height: size + 'px',
            }"
        />
        <model-viewer
            v-else-if="modelView"
            :src="imageUrl"
            :poster="posterUrl"
            class="nft-item"
            :class="[!isShowingDetails ? 'object-cover' : 'object-contain', size < 60 ? 'rounded-sm' : 'rounded']"
            :style="{
                width: size + 'px',
                height: size + 'px',
            }"
            ar
            ar-modes="webxr scene-viewer quick-look"
            environment-image="neutral"
            auto-rotate
            camera-controls
            loading="eager"
        />
        <img
            v-else
            :src="isShowingDetails ? imageUrl || posterUrl || defaultImage : posterUrl || imageUrl || defaultImage"
            class="nft-item"
            :class="[!isShowingDetails ? 'object-cover' : 'object-contain', size < 60 ? 'rounded-sm' : 'rounded']"
            :style="{
                width: size + 'px',
                height: size + 'px',
            }"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import config from '@/config';

@Options({
    props: {
        size: Number,
        posterUrl: String, // This should be image URL
        imageUrl: String, // This should be detailed URL
        isShowingDetails: Boolean,
    },
})
export default class NFTItem extends Vue {
    size!: Number;
    imageUrl!: String;
    defaultImage: String = config.defaultAvatar;
    isShowingDetails!: boolean;

    get modelView() {
        const result = (this.imageUrl?.endsWith('.glb') || this.imageUrl?.endsWith('.gltf')) && this.isShowingDetails;
        if (result) {
            import(/* webpackChunkName: "model-viewer" */ '@google/model-viewer');
        }
        return result;
    }
}
</script>

<style scoped lang="postcss">
@layer components {
    .nft-item {
        @apply border border-item-border filter bg-item-bg;
    }
}
</style>
