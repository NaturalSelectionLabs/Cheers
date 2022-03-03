<template>
    <div class="fixed left-0 top-0 m-0 h-screen w-screen p-0">
        <div class="absolute left-0 top-0 m-0 h-screen w-screen bg-black p-0 opacity-30" />
        <div
            class="relative left-1/2 top-1/2 flex h-80 w-80 -translate-x-1/2 -translate-y-1/2 transform flex-col justify-between rounded border-modal border-modal-border bg-modal-bg p-4"
        >
            <div class="text-center text-xl font-semibold text-primary-text">
                <slot name="header" />
            </div>
            <div class="h-full w-full flex-1 p-2">
                <slot name="body" />
            </div>
            <div class="footer">
                <slot name="footer" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({})
export default class Modal extends Vue {}
</script>

<style></style>
