<template>
    <div
        class="gitcoin-item"
        :class="{
            'w-10 h-10 rounded-sm': size === 'sm',
            'w-16 h-16 rounded': size === 'md',
            'w-full aspect-w-1 aspect-h-1 rounded': size === 'auto',
            rounded: size === 'contain',
        }"
    >
        <img :src="imageUrl || config.undefinedImageAlt" class="w-full h-full object-cover" />
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import config from '@/config';

@Options({
    props: {
        size: String,
        imageUrl: String,
    },
})
export default class GitcoinItem extends Vue {
    size!: String;
    imageUrl!: String;
    config = config;
}
</script>

<style scoped lang="postcss">
@layer components {
    .gitcoin-item {
        @apply bg-white bg-cover bg-center bg-no-repeat border border-white overflow-hidden;
    }
}
</style>
