<template>
    <div class="safe-area-fixed-bottom bg-footer-bg fixed bottom-0 left-0 mt-2 w-full">
        <div class="m-auto flex max-w-screen-lg flex-row items-center justify-end gap-x-2 px-4 py-2">
            <div class="text-right text-xs font-normal text-body-text">
                <a href="https://rss3.io/#/privacy"> Privacy </a>
                |
                <span>
                    Made with 🌀 by
                    <a
                        href="https://rss3.io"
                        class="text-xs font-normal text-body-text no-underline visited:no-underline active:no-underline"
                    >
                        RSS3
                    </a>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { Vue } from 'vue-class-component';
export default class Footer extends Vue {}
</script>

<style></style>
