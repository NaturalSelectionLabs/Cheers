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
        @apply flex flex-row items-center px-3 py-1 h-16 border-card rounded-xl box-border;

        .card-body {
            scrollbar-width: thin;
            @apply p-2 w-full overflow-y-auto;

            .content-wrapper {
                @apply flex items-center w-max;
            }
        }
    }
}
</style>
