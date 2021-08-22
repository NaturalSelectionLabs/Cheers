<template>
    <div
        class="img-holder"
        :class="{
            round: isRounded,
            square: isSquare,
            border: isBorder,
        }"
    >
        <img :src="src" :alt="alt" />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    props: {
        src: String,
        alt: String,
        isRounded: Boolean,
        isSquare: Boolean,
        isBorder: Boolean,
    },
})
export default class ImgHolder extends Vue {}
</script>

<style scoped lang="postcss">
@layer components {
    .img-holder {
        > img {
            @apply w-full h-full object-cover;
        }

        &.round {
            @apply rounded-full;

            > img {
                @apply rounded-full;
            }
        }

        &.square {
            @apply rounded;

            > img {
                @apply rounded;
            }
        }

        &.border {
            @apply border-white border-md;
        }
    }
}
</style>
