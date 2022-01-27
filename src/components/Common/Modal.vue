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
        @apply fixed left-0 top-0 m-0 p-0 w-screen h-screen;
        .shadow {
            @apply absolute left-0 top-0 m-0 p-0 w-screen h-screen bg-black opacity-30;
        }
        .dialog {
            @apply relative left-1/2 top-1/2 flex flex-col justify-between p-4 w-80 h-80 bg-modal-bg border-modal border-modal-border rounded transform -translate-x-1/2 -translate-y-1/2;
            .header {
                @apply text-center text-primary-text text-xl font-semibold;
            }
            .body {
                @apply flex-1 p-2 w-full h-full;
            }
        }
    }
}
</style>
