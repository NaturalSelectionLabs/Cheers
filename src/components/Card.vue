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
        <div class="card-content">
            <slot v-if="isHavingContent" name="content" />
            <span v-else class="body-tips" :class="colorTips">
                {{ $props.tips }}
            </span>
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
    components: {},
    props: {
        title: String,
        colorTitle: String,
        colorTips: String,
        colorBackground: String,
        tips: String,
        isHavingContent: Boolean,
    },
})
export default class Card extends Vue {}
</script>
<style>
@layer components {
    .card {
        @apply box-border rounded-xl pt-4 pb-4 pl-5 pr-5 flex flex-col items-start h-40;

        > * + * {
            @apply mt-5;
        }

        .card-header {
            @apply w-full flex justify-between items-center;
            .card-title-wrapper {
                .card-title {
                    @apply mr-1;
                }
            }
        }

        .card-content {
            @apply w-full overflow-y-auto;
            .body-tips {
                @apply flex w-full justify-center;
            }
        }

        .card-footer {
            @apply w-full flex flex-row justify-between font-normal mt-auto;

            > * {
                @apply flex m-auto mr-0;
            }

            .footer-tips {
                @apply text-center font-extralight;

                > * {
                    @apply mt-auto;
                }
            }
        }
    }
}
</style>
