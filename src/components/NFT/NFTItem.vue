<template>
    <div
        class="shadow-nft"
        :class="{
            'w-10 h-10 rounded-sm': size === 'sm',
            'w-16 h-16 rounded': size === 'md',
            'w-full aspect-w-1 aspect-h-1 rounded':
                size === 'auto' ||
                ((this.imageUrl?.endsWith('.glb') || this.imageUrl?.endsWith('.gltf')) && this.isShowingDetails),
            rounded: size === 'contain',
        }"
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
            :class="[!isShowingDetails ? 'object-cover' : 'object-contain', size === 'sm' ? 'rounded-sm' : 'rounded']"
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
            :class="[!isShowingDetails ? 'object-cover' : 'object-contain', size === 'sm' ? 'rounded-sm' : 'rounded']"
        />
        <model-viewer
            v-else-if="modelView"
            :src="imageUrl"
            :poster="posterUrl"
            class="nft-item"
            :class="[!isShowingDetails ? 'object-cover' : 'object-contain', size === 'sm' ? 'rounded-sm' : 'rounded']"
            ar-modes="webxr scene-viewer quick-look"
            environment-image="neutral"
            auto-rotate
            camera-controls
            loading="eager"
        />
        <img
            v-else
            :src="showImageUrl"
            class="nft-item"
            :class="[!isShowingDetails ? 'object-cover' : 'object-contain', size === 'sm' ? 'rounded-sm' : 'rounded']"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import config from '@/config';

@Options({
    props: {
        size: String,
        posterUrl: String, // This should be image URL
        imageUrl: String, // This should be detailed URL
        isShowingDetails: Boolean,
    },
})
export default class NFTItem extends Vue {
    size!: String;
    imageUrl!: String;
    posterUrl!: String;
    defaultImage: String = config.defaultAvatar;
    isShowingDetails!: boolean;

    get modelView() {
        const result = (this.imageUrl?.endsWith('.glb') || this.imageUrl?.endsWith('.gltf')) && this.isShowingDetails;
        if (result) {
            import(/* webpackChunkName: "model-viewer" */ '@google/model-viewer');
        }
        return result;
    }

    get showImageUrl() {
        // isShowingDetails ? imageUrl || posterUrl || defaultImage : posterUrl || imageUrl || defaultImage
        if (this.isShowingDetails) {
            // Prefer detailed URL
            return this.handleIPFS(this.imageUrl || this.posterUrl || this.defaultImage);
        } else {
            // Prefer preview URL
            return this.handleIPFS(this.posterUrl || this.imageUrl || this.defaultImage);
        }
    }

    handleIPFS(url: String) {
        if (url.startsWith('ipfs://')) {
            return url.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/');
        } else {
            return url;
        }
    }
}
</script>

<style scoped lang="postcss">
@layer components {
    .nft-item {
        @apply w-full h-full bg-item-bg border border-item-border filter;
    }
}
</style>
