<template>
    <div
        class="box-border rounded-xl px-5 py-1 flex flex-row items-center border-card h-16"
        :class="[`bg-${$props.color}-bg`, `border-${$props.color}-border`]"
    >
        <div class="p-2">
            <slot name="header" />
        </div>
        <div class="flex flex-row items-center w-full overflow-y-auto p-2">
            <slot name="content" />
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
