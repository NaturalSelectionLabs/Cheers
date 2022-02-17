<template>
    <button
        class="flex flex-row items-center justify-center gap-2 rounded-sm bg-secondary-btn px-3 pb-1 pt-1 text-center text-base font-light leading-none focus:outline-none"
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
export default class LinkButton extends Vue {
    size!: String;
}
</script>

<style></style>
