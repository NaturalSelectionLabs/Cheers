<template>
    <div
        class="overflow-hidden border border-white bg-white bg-cover bg-center bg-no-repeat"
        :class="{
            'h-10 w-10 rounded-sm': size === 'sm',
            'h-16 w-16 rounded': size === 'md',
            'aspect-w-1 aspect-h-1 w-full rounded': size === 'auto',
            rounded: size === 'contain',
        }"
    >
        <img :src="imageUrl || config.undefinedImageAlt" class="h-full w-full object-cover" />
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

<style></style>
