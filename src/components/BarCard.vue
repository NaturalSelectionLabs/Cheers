<template>
    <div class="card" :class="[`bg-${$props.color}-bg`, `border-${$props.color}-border`]">
        <div class="p-2">
            <slot name="header" />
        </div>
        <div class="card-body">
            <div class="content-wrapper">
                <slot name="content" />
            </div>
        </div>
        <div class="p-2">
            <slot name="footer" />
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

@Options({
    props: {
        color: String,
    },
})
export default class BarCard extends Vue {}
</script>

<style lang="postcss" scoped>
@layer components {
    .card {
        @apply box-border rounded-xl px-3 py-1 flex flex-row items-center border-card h-16;

        .card-body {
            scrollbar-width: thin;
            @apply w-full overflow-y-auto p-2;

            .content-wrapper {
                @apply flex items-center w-max;
            }
        }
    }
}
</style>
