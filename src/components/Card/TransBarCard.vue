<template>
    <div class="bg-blur flex flex-col gap-2 items-start p-3 border-card rounded box-border">
        <div v-if="title" class="flex flex-row items-center justify-between px-2 w-full text-primary-text">
            <div class="text-lg font-semibold">{{ title }}</div>
            <slot name="header" />
        </div>
        <div class="flex flex-col gap-1 px-2 w-full h-full" v-if="haveDetails">
            <slot name="details" />
        </div>
        <div class="flex flex-row gap-x-2 items-center justify-between w-full" v-if="haveContent">
            <div v-if="haveContentInfo" class="flex flex-1 px-2 overflow-x-auto" style="scrollbar-width: thin">
                <div class="flex flex-row items-center"><slot name="content" /></div>
            </div>
            <div v-else class="px-2 text-primary-text truncate">{{ tip }}</div>
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
        tip: String,
        haveDetails: Boolean,
        haveContent: Boolean,
        haveContentInfo: Boolean,
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
