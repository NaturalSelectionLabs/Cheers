<template>
    <img
        v-if="!(imageUrl?.endsWith('mp4') || imageUrl?.endsWith('mov'))"
        :style="{
            width: size + 'px',
            height: size + 'px',
        }"
        :src="imageUrl"
        class="nft-item"
    />
    <video
        v-else
        :style="{
            width: size + 'px',
            height: size + 'px',
        }"
        class="nft-item"
        autoplay
        loop
        muted
    >
        <source :src="imageUrl" :type="`video/${imageUrl.substring(imageUrl.lastIndexOf('.') + 1)}`" />
    </video>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

@Options({
    props: {
        size: Number,
        imageUrl: String,
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
        @apply rounded border border-white filter drop-shadow-nft bg-white bg-cover bg-center bg-no-repeat;
    }
}
</style>
