<template>
    <button
        class="flex transform flex-row items-center justify-center gap-2 border-button border-btn-border text-center leading-none focus:outline-none active:-translate-y-px"
        :class="{
            'rounded px-5 py-4': size === 'lg',
            'rounded-sm px-2 py-2': size === 'sm',
            'rounded-full': shape === 'circle',
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

<style></style>
