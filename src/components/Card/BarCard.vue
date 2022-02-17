<template>
    <div
        class="box-border flex h-16 flex-row items-center rounded-xl border-card px-3 py-1"
        :class="[`bg-${$props.color}-bg`, `border-${$props.color}-border`]"
    >
        <div class="p-2">
            <slot name="header" />
        </div>
        <div class="w-full overflow-y-auto p-2" style="scrollbar-width: thin">
            <div class="flex w-max items-center">
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

<style></style>
