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
        @apply flex flex-row gap-2 items-center justify-center text-center leading-none border-button border-btn-border focus:outline-none transform active:-translate-y-px;
    }
    .btn-lg {
        @apply px-5 py-4 rounded;
    }
    .btn-sm {
        @apply px-2 py-2 rounded-sm;
    }
    .circle {
        @apply rounded-full;
    }
}
</style>
