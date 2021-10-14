<template>
    <span
        class="tooltip"
        :class="[marginLeftClass, widthClass, heightClass, !widthClass && !heightClass ? 'whitespace-nowrap' : '']"
        >{{ text }}</span
    >
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

@Options({
    props: {
        text: String,
        heightClass: String,
        widthClass: String,
        marginLeftClass: String,
    },
})
export default class Tooltip extends Vue {
    text!: String;
    heightClass!: String;
    widthClass!: String;
    marginLeftClass!: String;
}
</script>

<style lang="postcss" scoped>
@layer components {
    .tooltip {
        @apply absolute rounded-sm px-2 py-1 text-primary-text bg-primary-link font-normal border-link border-primary-link-border z-10;
        left: calc(100% + 5px);
        top: calc(50% - 14px);
    }

    .tooltip::after {
        content: '';
        @apply absolute bottom-full left-0 -ml-2 top-3 border-solid border-4;
        border-color: transparent var(--color-sharebutton-border) transparent transparent;
    }
}
</style>
