<template>
    <button
        class="btn"
        :class="{
            'btn-lg': size === 'lg',
            'btn-sm': size === 'sm',
            circle: shape === 'circle',
        }"
    >
        <slot></slot>
    </button>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

@Options({
    props: {
        size: String,
        shape: String,
    },
})
export default class Button extends Vue {
    size!: String;
    shape!: String;
}
</script>

<style scoped lang="postcss">
@layer components {
    .btn {
        @apply focus:outline-none transform active:-translate-y-px flex flex-row gap-2 justify-center items-center text-center leading-none border-btn-border border-button;
    }
    .btn-lg {
        @apply rounded px-5 py-4;
    }
    .btn-sm {
        @apply rounded-sm px-2 py-2;
    }
    .circle {
        @apply rounded-full;
    }
}
</style>
