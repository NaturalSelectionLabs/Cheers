<template>
    <div
        class="box-border flex flex-col items-start gap-2 rounded border-card px-5 py-4"
        :class="$props.isSecondary ? 'bg-secondary' : 'bg-card-bg'"
    >
        <div
            v-if="title"
            class="flex w-full flex-row items-center justify-between"
            :class="$props.isSecondary ? 'text-black text-opacity-50' : ''"
        >
            <div class="text-lg font-semibold leading-none">{{ title }}</div>
            <slot name="header" />
        </div>
        <div class="flex h-full w-full flex-col gap-1 overflow-hidden" v-if="haveDetails">
            <slot name="details" />
        </div>
        <div class="flex w-full flex-row items-center justify-between gap-x-2" v-if="haveContent">
            <div v-if="haveContentInfo" class="flex flex-1 overflow-x-auto pb-1" style="scrollbar-width: thin">
                <div class="flex flex-row items-center"><slot name="content" /></div>
            </div>
            <div v-else class="text-light truncate">
                <div v-if="tip === 'loading'" class="flex items-start justify-center gap-2">
                    <span class="font-light">One moment </span>
                    <LoadingSmile :size="18" :isLooping="true" />
                </div>
                <div v-else-if="tip === 'ownerEmpty'" class="flex items-start justify-center gap-2">
                    <span v-if="title === 'Collectibles'" class="font-light">Grab some collectibles to get a shot</span>
                    <span v-if="title === 'Footprints'" class="font-light">Attend some events to get a shot</span>
                    <span v-if="title === 'Donations'" class="font-light">Support some projects to get a shot</span>
                    <Smile :size="18" />
                </div>
                <div v-else class="flex flex-row items-end gap-2">
                    <span class="font-light">
                        Looks like this user hasn't got a shot.<br />Come back and check it out later.
                    </span>
                    <Smile :size="18" class="mb-1" />
                </div>
            </div>
            <div class="shrink-0">
                <slot name="button" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import LoadingSmile from '@/components/Loading/LoadingSmile.vue';
import Smile from '@/components/Icons/Smile.vue';

@Options({
    props: {
        title: String,
        tip: String,
        haveDetails: Boolean,
        haveContent: Boolean,
        haveContentInfo: Boolean,
        isSecondary: Boolean,
    },
    components: {
        LoadingSmile,
        Smile,
    },
})
export default class TransBarCard extends Vue {}
</script>

<style lang="postcss" scoped></style>
