<template>
    <div class="trait-container">
        <div class="trait-type">{{ traitType }}</div>
        <div class="trait-value">{{ traitValue }}</div>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

@Options({
    props: {
        traitType: String,
        traitValue: String,
    },
})
export default class Trait extends Vue {
    traitType!: String;
    traitValue!: String;
}
</script>

<style scoped lang="postcss">
@layer components {
    .trait-container {
        @apply flex flex-col gap-1 items-start justify-center px-5 py-3 text-body-text leading-none bg-primary-btn bg-opacity-10 border-card rounded-sm;
    }
    .trait-type {
        @apply text-xs font-normal uppercase;
    }
    .trait-value {
        @apply text-sm font-medium capitalize;
    }
}
</style>
