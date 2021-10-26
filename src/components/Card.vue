<template>
    <div class="card" :class="colorBackground">
        <div class="card-header">
            <div class="card-title-wrapper">
                <slot name="title-icon" />
                <span class="card-title" :class="colorTitle">
                    {{ $props.title }}
                </span>
                <slot name="accessibility" />
            </div>
            <slot name="header-button" />
        </div>
        <div
            class="card-content"
            :class="{
                'PC-layout': isPClayout,
                'single-line': isSingleLine,
            }"
        >
            <div
                class="content-wrapper"
                :class="{
                    content: isHavingContent,
                }"
            >
                <slot v-if="isHavingContent" name="content" />
                <div v-else class="body-tips" :class="colorTips">
                    {{ $props.tips }}
                </div>
            </div>
        </div>
        <div class="card-footer">
            <span v-if="isHavingContent" class="footer-tips" :class="colorTips">
                {{ $props.tips }}
            </span>
            <slot name="footer-button" />
        </div>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    props: {
        title: String,
        colorTitle: String,
        colorTips: String,
        colorBackground: String,
        tips: String,
        isHavingContent: Boolean,
        isSingleLine: Boolean,
        isPClayout: Boolean,
    },
})
export default class Card extends Vue {}
</script>
<style scoped lang="postcss">
@layer components {
    .card {
        @apply flex flex-col items-start pb-4 pl-5 pr-5 pt-4 border-card rounded-xl box-border;

        > * + * {
            @apply my-5;
        }

        .card-header {
            @apply flex items-center justify-between w-full;
            .card-title-wrapper {
                @apply flex gap-2 items-center justify-start;
                .card-title {
                    @apply mr-1 text-xl font-semibold;
                }
            }
        }

        .card-content {
            @apply scrollbar-hide mx-auto w-full h-full break-all;
            > .content-wrapper {
                @apply min-h-20;

                &:not(.content) {
                    @apply flex;
                }
            }
            &.single-line {
                @apply overflow-y-auto;
                > .content-wrapper {
                    @apply pb-4 px-4 w-max;
                }
            }
            &.PC-layout {
                @apply max-h-36 overflow-y-auto;
            }
            .body-tips {
                @apply flex items-center justify-center w-full;
            }
        }

        .card-footer {
            @apply flex flex-row justify-between mb-0 mt-auto w-full font-normal;

            > * {
                @apply flex m-auto mr-0;
            }

            .footer-tips {
                @apply flex justify-start ml-0 text-left text-sm font-extralight;
            }
        }
    }
}
</style>
