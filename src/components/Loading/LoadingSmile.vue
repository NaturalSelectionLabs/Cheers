<template>
    <div
        class="lottie-container"
        ref="lottieContainer"
        :style="{
            width: size + 'px',
        }"
    ></div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import animationData from '@/assets/smile.json';
@Options({
    props: {
        size: Number,
        isLooping: Boolean,
    },
})
export default class LoadingSmile extends Vue {
    size!: Number;
    isLooping!: Boolean;

    defaultOptions: Object = { animationData: animationData };
    async mounted() {
        const lottie: any = await import(/* webpackChunkName: "lottie" */ 'lottie-web');
        lottie.loadAnimation({
            container: <Element>this.$refs.lottieContainer,
            renderer: 'svg',
            loop: this.isLooping,
            autoplay: true,
            animationData: animationData,
        });
    }
}
</script>

<style lang="postcss" scoped></style>
