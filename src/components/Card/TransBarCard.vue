<template>
    <div class="card bg-blur">
        <div class="p-2 text-primary-text text-lg font-semibold">{{ title }}</div>
        <div class="flex flex-row gap-x-2 items-start w-full">
            <div class="card-body">
                <div class="content-wrapper">
                    <slot name="content" />
                </div>
            </div>
            <div class="flex-shrink-0 pt-1">
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
    .card {
        @apply flex flex-col items-start px-3 h-28 border-card rounded-xl box-border;

        .card-body {
            scrollbar-width: thin;
            @apply flex flex-1 flex-row gap-2 items-center p-2 pt-0 w-0 overflow-y-auto;

            .content-wrapper {
                @apply flex flex-1 flex-row items-center;
            }

            .button-wrapper {
                @apply flex-shrink-0;
            }
        }
    }

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
