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
        @apply rounded-sm px-5 py-3 bg-body-bg flex flex-col justify-center items-start gap-1 leading-none border-card border-nft-trait-border;
    }
    .trait-type {
        @apply uppercase text-nft-trait-type font-normal text-xs;
    }
    .trait-value {
        @apply capitalize text-body-text font-medium text-sm;
    }
}
</style>
