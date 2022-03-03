<template>
    <div
        :class="{
            'h-10 w-10 rounded-sm': size === 'sm',
            'h-16 w-16 rounded': size === 'md',
            'h-22 w-22 rounded md:h-28 md:w-28': size === 'xl',
            'aspect-w-1 aspect-h-1 w-full rounded':
                size === 'auto' ||
                (viewType === 'model' && isShowingDetails) ||
                (!(imageUrl && posterUrl) && isShowingDetails),
            rounded: size === 'contain',
        }"
    >
        <video
            v-if="viewType === 'video'"
            :src="mainUrl"
            :poster="subUrl"
            class="h-full w-full border border-item-border bg-item-bg filter"
            :class="variableNFTClass"
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
            class="h-full w-full border border-item-border bg-item-bg filter"
            :class="variableNFTClass"
        />
        <model-viewer
            v-else-if="viewType === 'model'"
            :src="mainUrl"
            class="h-full w-full border border-item-border bg-item-bg filter"
            :class="variableNFTClass"
            ar
            ar-modes="webxr scene-viewer quick-look"
            environment-image="neutral"
            auto-rotate
            camera-controls
            loading="eager"
        />
        <img
            v-else
            :src="mainUrl"
            class="h-full w-full border border-item-border bg-item-bg filter"
            :class="variableNFTClass"
            @error="replaceByDefault"
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
            (this.isShowingDetails ? this.imageUrl || this.posterUrl : this.posterUrl || this.imageUrl) ||
                config.undefinedImageAlt,
        );
    }

    handleIPFS(url: String) {
        if (url.startsWith('ipfs://')) {
            return url.replace('ipfs://', 'https://infura-ipfs.io/ipfs/');
        } else {
            return url;
        }
    }

    get viewType(): 'video' | 'website' | 'model' | 'image' {
        if (this.mainUrl.endsWith('.mp4') || this.mainUrl.endsWith('.mov') || this.mainUrl.endsWith('.webm')) {
            if (
                !(
                    this.posterUrl?.endsWith('.mp4') ||
                    this.posterUrl?.endsWith('.mov') ||
                    this.posterUrl?.endsWith('.webm')
                )
            ) {
                this.subUrl = this.posterUrl?.toString();
            } else {
                this.subUrl = undefined;
            }
            return 'video';
        } else if (
            this.mainUrl.endsWith('.html') ||
            this.mainUrl.includes('farmhero.io') ||
            this.mainUrl.includes('0xAdventures.com') ||
            this.mainUrl.includes('crudefingers.com') ||
            this.mainUrl.includes('artblocks.io')
        ) {
            return 'website';
        } else if (this.mainUrl.endsWith('.gltf') || this.mainUrl.endsWith('.glb')) {
            return 'model';
        } else {
            return 'image';
        }
    }

    get variableNFTClass() {
        return [
            !this.isShowingDetails ? 'object-cover' : 'object-contain',
            this.size === 'sm' ? 'rounded-sm' : 'rounded',
        ];
    }

    replaceByDefault(e) {
        e.target.src = config.undefinedImageAlt;
    }
}
</script>

<style></style>
