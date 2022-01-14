<template>
    <div
        class="footprint-item"
        :class="{
            'w-10 h-10 rounded-sm': size === 'sm',
            'w-17.5 h-17.5 rounded': size === 'md',
            'w-19 h-19 rounded': size === 'lg',
            'w-22 h-22 md:w-28 md:h-28 rounded': size === 'xl',
            'w-full aspect-w-1 aspect-h-1 rounded': size === 'auto',
        }"
        :style="{
            backgroundImage: `url(${imageUrl || config.undefinedImageAlt})`,
        }"
    />
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import config from '@/common/config';

@Options({
    props: {
        size: String,
        imageUrl: String,
    },
})
export default class FootprintItem extends Vue {
    size!: String;
    imageUrl!: String;
    config = config;
}
</script>

<style scoped lang="postcss">
@layer components {
    .footprint-item {
        @apply bg-white bg-cover bg-center bg-no-repeat border border-white rounded-full filter;
    }
}
</style>
