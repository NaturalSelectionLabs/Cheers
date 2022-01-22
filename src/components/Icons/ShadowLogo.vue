<template>
    <svg width="250" height="286" viewBox="0 0 250 286" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_3832_1265)">
            <path
                d="M94 247V154.05M94 154.05V54.6C94 53.1641 95.1641 52 96.6 52H195.4C196.836 52 198 53.1641 198 54.6V151.45C198 152.886 196.836 154.05 195.4 154.05H94Z"
                stroke="url(#paint0_angular_3832_1265)"
                stroke-width="104"
                shape-rendering="crispEdges"
            />
        </g>
        <defs>
            <filter
                id="filter0_d_3832_1265"
                x="0.91358"
                y="0"
                width="249.086"
                height="285.716"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
            >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                />
                <feOffset dx="-25.284" dy="22.9136" />
                <feGaussianBlur stdDeviation="7.90123" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.447059 0 0 0 0 1 0 0 0 0.11 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3832_1265" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3832_1265" result="shape" />
            </filter>
            <radialGradient
                id="paint0_angular_3832_1265"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(146 149.5) rotate(90) scale(66.3 52)"
            >
                <stop stop-color="#D5E4F6" />
                <stop offset="1" stop-color="#0072FF" />
            </radialGradient>
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
export default class Logo extends Vue {}
</script>

<style lang="postcss" scoped></style>
