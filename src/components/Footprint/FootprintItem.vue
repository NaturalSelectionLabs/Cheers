<template>
    <div
        class="rounded-full border border-white bg-white bg-cover bg-center bg-no-repeat filter"
        :class="{
            'h-10 w-10 rounded-sm': size === 'sm',
            'h-17.5 w-17.5 rounded': size === 'md',
            'h-19 w-19 rounded': size === 'lg',
            'h-22 w-22 rounded md:h-28 md:w-28': size === 'xl',
            'aspect-w-1 aspect-h-1 w-full rounded': size === 'auto',
        }"
        :style="{
            backgroundImage: `url(${imageUrl || config.undefinedImageAlt})`,
        }"
    />
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
export default class FootprintItem extends Vue {
    size!: String;
    imageUrl!: String;
    config = config;
}
</script>

<style></style>
