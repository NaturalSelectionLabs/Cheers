<template>
    <span
        class="tooltip"
        :class="{
            'color-default': viewOption === 'default' || !viewOption,
            'color-account': viewOption === 'account',
        }"
        >{{ text }}</span
    >
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

@Options({
    props: {
        text: String,
        viewOption: String,
    },
})
export default class Tooltip extends Vue {
    text!: String;
}
</script>

<style lang="postcss" scoped>
@layer components {
    .tooltip {
        @apply absolute z-10 px-2 py-1 whitespace-nowrap font-normal border-link rounded-sm;
        left: calc(100% + 5px);
        top: calc(50% - 14px);
    }

    .tooltip::after {
        content: '';
        @apply absolute bottom-full left-0 top-3 -ml-2 border-4 border-solid;
    }

    .color-default {
        @apply text-primary-text bg-secondary-btn;
        &.tooltip::after {
            border-color: transparent rgba(0, 114, 255, 0.1) transparent transparent;
        }
    }

    .color-account {
        @apply text-account-title bg-account-bg;
        &.tooltip::after {
            border-color: transparent #f6fff5 transparent transparent;
        }
    }
}
</style>
