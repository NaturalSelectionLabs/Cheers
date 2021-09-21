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
        viewType: String,
    },
})
export default class Tooltip extends Vue {
    text!: String;
    heightClass!: String;
    widthClass!: String;
    marginLeftClass!: String;
    viewType!: String;
}
</script>

<style lang="postcss" scoped>
@layer components {
    .tooltip {
        @apply absolute transform -translate-x-1/2 inline-block top-0 left-1/2 rounded-sm px-2 py-1 text-primary-text bg-primary-link font-normal border-link border-primary-link-border;
        left: calc(100% + 45px);
    }

    .tooltip::after {
        content: '';
        @apply absolute bottom-full left-0 -ml-2 top-3 border-solid border-4;
        border-color: transparent var(--color-sharebutton-border) transparent transparent;
    }
}
</style>
