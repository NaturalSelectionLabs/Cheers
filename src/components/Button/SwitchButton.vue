<template>
    <button
        class="
            flex flex-row
            gap-2
            items-center
            justify-center
            px-3
            py-2
            text-center text-base
            leading-none
            border-link border-primary-link-border
            rounded-sm
            focus:outline-none
        "
        :class="isActivated ? 'text-white bg-primary-text bg-opacity-70' : 'text-primary-text bg-primary-link'"
    >
        <slot></slot>
    </button>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
@Options({
    props: {
        isActivated: Boolean,
    },
})
export default class SwitchButton extends Vue {}
</script>

<style scoped lang="postcss"></style>
