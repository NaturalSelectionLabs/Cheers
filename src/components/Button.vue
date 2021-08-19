<template>
    <button
        class="btn"
        :class="{
            'btn-lg': size === 'lg',
            'btn-sm': size === 'sm',
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
    },
})
export default class Button extends Vue {
    size!: String;
}
</script>

<style scoped lang="postcss">
@layer components {
    .btn {
        @apply focus:outline-none transform active:-translate-y-px flex flex-row gap-2 justify-center items-center text-center;
    }
    .btn-lg {
        @apply rounded px-5 py-3.5;
    }
    .btn-sm {
        @apply rounded-sm px-2 py-2;
    }
}
</style>
