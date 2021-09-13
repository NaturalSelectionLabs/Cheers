<template>
    <div
        class="gitcoin-item"
        :style="{
            width: size + 'px',
            height: size + 'px',
            backgroundImage: `url(${imageUrl})`,
        }"
    />
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

@Options({
    props: {
        size: Number,
        imageUrl: String,
    },
})
export default class GitcoinItem extends Vue {
    size!: Number;
    imageUrl!: String;
}
</script>

<style scoped lang="postcss">
@layer components {
    .gitcoin-item {
        @apply rounded border border-white filter shadow-gitcoin bg-white bg-cover bg-center bg-no-repeat;
    }
}
</style>
