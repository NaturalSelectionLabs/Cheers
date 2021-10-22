<template>
    <div
        class="footprint-item"
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
export default class FootprintItem extends Vue {
    size!: Number;
    imageUrl!: String;
}
</script>

<style scoped lang="postcss">
@layer components {
    .footprint-item {
        @apply rounded-full border border-white filter shadow-footprint bg-white bg-cover bg-center bg-no-repeat;
    }
}
</style>
