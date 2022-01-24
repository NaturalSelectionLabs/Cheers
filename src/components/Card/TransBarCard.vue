<template>
    <div
        class="flex flex-col gap-2 items-start px-5 py-4 border-card rounded box-border"
        :class="$props.isSecondary ? 'bg-secondary' : 'bg-card-bg'"
    >
        <div
            v-if="title"
            class="flex flex-row items-center justify-between w-full"
            :class="$props.isSecondary ? 'text-black text-opacity-50' : ''"
        >
            <div class="text-lg font-semibold leading-none">{{ title }}</div>
            <slot name="header" />
        </div>
        <div class="flex flex-col gap-1 w-full h-full overflow-hidden" v-if="haveDetails">
            <slot name="details" />
        </div>
        <div class="flex flex-row gap-x-2 items-center justify-between w-full" v-if="haveContent">
            <div v-if="haveContentInfo" class="flex flex-1 pb-1 overflow-x-auto" style="scrollbar-width: thin">
                <div class="flex flex-row items-center"><slot name="content" /></div>
            </div>
            <div v-else class="text-light truncate">
                <div v-if="tip === 'loading'" class="flex gap-2 items-start justify-center">
                    <span class="font-light">One moment </span>
                    <LoadingSmileContainer :isLooping="true" />
                </div>
                <div v-else>
                    <div v-if="tip === 'ownerEmpty'" class="flex gap-2 items-start justify-center">
                        <span v-if="title === 'Vitrine'" class="font-light">Grab some collectibles to get a shot</span>
                        <span v-if="title === 'Footprints'" class="font-light">Fund some projects to get a shot</span>
                        <span v-if="title === 'Donations'" class="font-light">Attend some events to get a shot</span>
                        <Smile :size="18" />
                    </div>
                    <div v-else>
                        <span class="font-light"
                            >Looks like this user hasn't got a shot. Come back and check it out later</span
                        >
                        <Smile :size="18" />
                    </div>
                </div>
            </div>
            <div class="flex-shrink-0">
                <slot name="button" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Smile from '@/components/Icons/Smile.vue';
import LoadingSmileContainer from '@/components/Loading/LoadingSmileContainer.vue';

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
        Smile,
        LoadingSmileContainer,
    },
})
export default class TransBarCard extends Vue {}
</script>

<style lang="postcss" scoped></style>
