<template>
    <div class="card" :class="colorBackground">
        <div class="card-header">
            <div class="card-title-wrapper">
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
    },
})
export default class Card extends Vue {}
</script>
<style scoped lang="postcss">
@layer components {
    .card {
        @apply box-border rounded-xl pt-4 pb-4 pl-5 pr-5 flex flex-col items-start;

        > * + * {
            @apply my-5;
        }

        .card-header {
            @apply w-full flex justify-between items-center;
            .card-title-wrapper {
                .card-title {
                    @apply mr-1 text-xl font-semibold;
                }
            }
        }

        .card-content {
            @apply break-all mx-auto w-full h-full;
            > .content-wrapper {
                @apply min-h-20 h-full;

                &:not(.content) {
                    @apply flex;
                }
            }
            &.single-line {
                @apply overflow-y-auto;
                > .content-wrapper {
                    @apply w-max px-4 pb-4;
                }
            }
            .body-tips {
                @apply flex w-full justify-start items-center;
            }
        }

        .card-footer {
            @apply w-full flex flex-row justify-between font-normal mt-auto mb-0;

            > * {
                @apply flex m-auto mr-0;
            }

            .footer-tips {
                @apply text-left font-extralight ml-0 flex justify-start text-sm;
            }
        }
    }
}
</style>
