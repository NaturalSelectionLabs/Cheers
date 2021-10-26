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
        @apply flex flex-col gap-1 items-start justify-center px-5 py-3 leading-none bg-body-bg border-card border-nft-trait-border rounded-sm;
    }
    .trait-type {
        @apply text-nft-trait-type text-xs font-normal uppercase;
    }
    .trait-value {
        @apply text-body-text text-sm font-medium capitalize;
    }
}
</style>
