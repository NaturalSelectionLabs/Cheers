<template>
    <span
        class="tooltip absolute z-10 whitespace-nowrap rounded-sm border-link px-2 py-1 font-normal"
        :class="{
            'color-default bg-secondary-btn text-primary-text': viewOption === 'default' || !viewOption,
            'color-account bg-account-bg text-account-title': viewOption === 'account',
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
.tooltip {
    left: calc(100% + 5px);
    top: calc(50% - 14px);
}

.tooltip::after {
    content: '';
    /* absolute */
    position: absolute;
    /* bottom-full */
    bottom: 100%;
    /* left-0 */
    left: 0;
    /* top-3 */
    top: 0.75rem;
    /* -ml-2 */
    margin-left: -0.5rem;
    /* border-4 */
    border-width: 4px;
    /* border-solid */
    border-style: solid;
}

.tooltip.color-default::after {
    border-color: transparent rgba(0, 114, 255, 0.1) transparent transparent;
}

.tooltip.color-account::after {
    border-color: transparent #f6fff5 transparent transparent;
}
</style>
