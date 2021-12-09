<template>
    <div
        class="footprint-item"
        :class="{
            'w-10 h-10 rounded-sm': size === 'sm',
            'w-17.5 h-17.5 rounded': size === 'md',
            'w-19 h-19 rounded': size === 'lg',
            'w-full aspect-w-1 aspect-h-1 rounded': size === 'auto',
        }"
        :style="{
            backgroundImage: `url(${imageUrl})`,
        }"
    />
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

@Options({
    props: {
        size: String,
        imageUrl: String,
    },
})
export default class FootprintItem extends Vue {
    size!: String;
    imageUrl!: String;
}
</script>

<style scoped lang="postcss">
@layer components {
    .footprint-item {
        @apply bg-white bg-cover bg-center bg-no-repeat border border-white rounded-full shadow-footprint filter;
    }
}
</style>
