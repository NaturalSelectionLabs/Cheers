<template>
    <div
        class="shadow-nft"
        :class="{
            'w-10 h-10 rounded-sm': size === 'sm',
            'w-16 h-16 rounded': size === 'md',
            'w-full aspect-w-1 aspect-h-1 rounded': size === 'auto' || viewType === 'model',
            rounded: size === 'contain',
        }"
    >
        <video
            v-if="viewType === 'video'"
            :src="mainUrl"
            :poster="subUrl"
            class="nft-item"
            :class="[!isShowingDetails ? 'object-cover' : 'object-contain', size === 'sm' ? 'rounded-sm' : 'rounded']"
            :autoplay="isShowingDetails"
            loop
            webkit-playsinline
            playsinline
            muted
            :controls="isShowingDetails"
        />
        <iframe
            v-else-if="viewType === 'website'"
            :src="mainUrl"
            class="nft-item"
            :class="[!isShowingDetails ? 'object-cover' : 'object-contain', size === 'sm' ? 'rounded-sm' : 'rounded']"
        />
        <model-viewer
            v-else-if="viewType === 'model'"
            :src="mainUrl"
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
            :src="mainUrl"
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
        posterUrl: String, // This should be preview URL
        imageUrl: String, // This should be detail URL
        isShowingDetails: Boolean,
    },
})
export default class NFTItem extends Vue {
    size!: String;
    imageUrl!: String;
    posterUrl!: String;
    isShowingDetails!: boolean;
    subUrl: string | undefined;

    get mainUrl() {
        return this.handleIPFS(
            this.isShowingDetails
                ? this.imageUrl || this.posterUrl || config.defaultAvatar
                : this.posterUrl || this.imageUrl || config.defaultAvatar,
        );
    }

    handleIPFS(url: String) {
        if (url.startsWith('ipfs://')) {
            return url.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/');
        } else {
            return url;
        }
    }

    get viewType(): 'video' | 'website' | 'model' | 'image' {
        if (this.imageUrl?.endsWith('.mp4') || this.imageUrl?.endsWith('.mov') || this.imageUrl?.endsWith('.webm')) {
            if (
                !(
                    this.posterUrl?.endsWith('.mp4') ||
                    this.posterUrl?.endsWith('.mov') ||
                    this.posterUrl?.endsWith('.webm')
                )
            ) {
                this.subUrl = this.posterUrl.toString();
            } else {
                this.subUrl = undefined;
            }
            return 'video';
        } else if (
            this.imageUrl?.endsWith('.html') ||
            this.imageUrl?.includes('farmhero.io') ||
            this.imageUrl?.includes('0xAdventures.com') ||
            this.imageUrl?.includes('crudefingers.com') ||
            this.imageUrl?.includes('artblocks.io')
        ) {
            return 'website';
        } else if (this.imageUrl?.endsWith('.gltf') || this.imageUrl?.endsWith('.glb')) {
            import(/* webpackChunkName: "model-viewer" */ '@google/model-viewer');
            return 'model';
        } else {
            return 'image';
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
