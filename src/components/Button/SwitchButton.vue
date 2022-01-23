<template>
    <button
        class="
            flex flex-row
            gap-2
            items-center
            justify-center
            px-3
            py-2
            text-center text-body-text text-base
            leading-none
            rounded-sm
            focus:outline-none
        "
        :class="isActivated ? 'bg-primary-text bg-opacity-70' : 'bg-secondary-btn'"
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
