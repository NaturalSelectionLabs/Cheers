<template>
    <button class="link-btn">
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
export default class LinkButton extends Vue {
    size!: String;
}
</script>

<style scoped lang="postcss">
@layer components {
    .link-btn {
        @apply focus:outline-none flex flex-row gap-2 justify-center items-center text-center px-3 pt-1 pb-1.5 font-medium text-lg leading-none text-primary-text bg-primary-link border-link border-primary-link rounded-sm;
    }
}
</style>
