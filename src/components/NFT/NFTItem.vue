<template>
    <div
        class="nft-item"
        :style="{
            width: size + 'px',
            height: size + 'px',
            backgroundImage: `url(${imageUrl})`,
        }"
    >
        <slot></slot>
    </div>
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
        @apply rounded border border-white filter drop-shadow-nft bg-cover bg-center bg-no-repeat;
    }
}
</style>
