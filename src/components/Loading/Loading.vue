<template>
    <div
        class="lottie-container"
        ref="lottieContainer"
        :style="{
            width: size + 'px',
            height: size + 'px',
        }"
    ></div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import animationData from '@/assets/loadingAnimationData.json';
@Options({
    props: {
        size: Number,
    },
})
export default class Loading extends Vue {
    size!: Number;
    defaultOptions: Object = { animationData: animationData };
    async mounted() {
        const lottie: any = await import(/* webpackChunkName: "lottie" */ 'lottie-web');
        lottie.loadAnimation({
            container: <Element>this.$refs.lottieContainer,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: animationData,
        });
    }
}
</script>

<style lang="postcss" scoped></style>
