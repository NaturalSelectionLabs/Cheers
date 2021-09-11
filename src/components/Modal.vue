<template>
    <div class="modal">
        <div class="shadow" />
        <div class="dialog">
            <div class="header">
                <slot name="header" />
            </div>
            <div class="body">
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

<style scoped lang="postcss">
@layer components {
    .modal {
        @apply fixed w-screen h-screen m-0 p-0 top-0 left-0;
        .shadow {
            @apply absolute w-screen h-screen m-0 p-0 top-0 left-0 bg-black opacity-50;
        }
        .dialog {
            @apply relative left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-modal-bg border-modal border-modal-border rounded w-80 h-80 p-4;
            .header {
                @apply text-xl font-semibold text-center text-primary-text;
            }
            .body {
                @apply p-2 w-full h-full;
            }
            .footer {
                @apply absolute bottom-4;
            }
        }
    }
}
</style>
