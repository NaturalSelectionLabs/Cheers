<template>
    <svg :width="size" :height="size" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="99.5" cy="100" rx="99.5" ry="100" fill="#FFE411" />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M77.7602 163.545L63.1068 142.816C62.8244 142.415 62.7124 141.919 62.7955 141.436C62.8786 140.953 63.15 140.523 63.55 140.24L73.2386 133.393C83.2636 126.305 89.2477 116.474 89.2477 102.47V39.3602C89.2477 38.3386 90.075 37.5136 91.0955 37.5136H116.956V102.47C116.956 127.962 109.857 140.68 88.958 155.63L77.7602 163.544V163.545Z"
            fill="#FEFEFE"
        />
        <mask id="mask0_1_2" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="76" y="37" width="52" height="134">
            <path
                d="M116.19 37.5136V101.386C116.19 126.88 109.09 139.595 88.192 154.544L76.9932 162.46L82.3239 170.002C82.607 170.402 83.0371 170.673 83.5199 170.756C84.0027 170.839 84.4987 170.727 84.8989 170.444L94.6386 163.559C107.033 154.694 114.795 146.545 119.808 137.13C124.973 127.443 127.273 116.417 127.273 101.386V39.3602C127.273 38.3409 126.444 37.5136 125.425 37.5136H116.19Z"
                fill="white"
            />
        </mask>
        <g mask="url(#mask0_1_2)">
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M116.19 37.5136V101.386C116.19 126.88 109.09 139.595 88.192 154.544L76.9932 162.46L82.3239 170.002C82.607 170.402 83.0371 170.673 83.5199 170.756C84.0027 170.839 84.4987 170.727 84.8989 170.444L94.6386 163.559C107.033 154.694 114.795 146.545 119.808 137.13C124.973 127.443 127.273 116.417 127.273 101.386V39.3602C127.273 38.3409 126.444 37.5136 125.425 37.5136H116.19Z"
                fill="url(#paint0_linear_1_2)"
            />
        </g>
        <defs>
            <linearGradient
                id="paint0_linear_1_2"
                x1="102.133"
                y1="37.5136"
                x2="102.133"
                y2="170.783"
                gradientUnits="userSpaceOnUse"
            >
                <stop stop-color="#E9FFFF" />
                <stop offset="1" stop-color="#01B1E7" />
            </linearGradient>
        </defs>
    </svg>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    props: {
        size: Number,
    },
})
export default class Jike extends Vue {}
</script>

<style></style>
