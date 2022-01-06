<template>
    <div class="bg-blur flex flex-col items-start p-3 pt-0 min-h-28 border-card rounded-xl box-border">
        <div class="flex flex-row items-center justify-between p-2 w-full text-primary-text">
            <div class="text-lg font-semibold">{{ title }}</div>
            <slot name="header" />
        </div>
        <!-- <div class="flex flex-col gap-1 p-2">
            <slot name="details" />
        </div> -->
        <div class="flex flex-row gap-x-2 items-center w-full">
            <div class="flex flex-1 p-2 pt-0 overflow-x-auto" style="scrollbar-width: thin">
                <div class="flex flex-row items-center"><slot name="content" /></div>
            </div>
            <div class="flex-shrink-0">
                <slot name="button" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

@Options({
    props: {
        title: String,
    },
})
export default class TransBarCard extends Vue {}
</script>

<style lang="postcss" scoped>
@layer components {
    /* slightly transparent fallback */
    .bg-blur {
        background-color: rgba(255, 255, 255, 0.6);
    }

    @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
        .bg-blur {
            background-color: rgba(255, 255, 255, 0.6);
            -webkit-backdrop-filter: blur(2em);
            backdrop-filter: blur(2em);
        }
    }
}
</style>
