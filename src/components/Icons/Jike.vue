<template>
    <svg width="40" height="40" viewBox="0 0 176 176">
        <defs>
            <path id="prefix__a" d="M0 .627h175.373v175.372H0z"></path>
            <path
                id="prefix__c"
                d="M35.247.012V56.22c0 22.434-6.248 33.624-24.638 46.779l-9.855 6.966 4.691 6.637a1.627 1.627 0 002.266.389l8.571-6.059c10.907-7.801 17.738-14.972 22.149-23.258C42.976 79.15 45 69.447 45 56.22V1.637C45 .74 44.271.012 43.374.012h-8.127z"
            ></path>
            <linearGradient id="prefix__d" x1="50%" x2="50%" y1="0%" y2="100%">
                <stop offset="0%" stop-color="#E9FFFF"></stop>
                <stop offset="100%" stop-color="#01B1E7"></stop>
            </linearGradient>
        </defs>
        <g fill="none" fill-rule="evenodd">
            <path
                fill="#FFE411"
                d="M135.959 176H39.414C17.646 176 0 158.354 0 136.585V40.041C0 18.272 17.646.627 39.414.627h96.545c21.768 0 39.414 17.645 39.414 39.414v96.544c0 21.77-17.646 39.415-39.414 39.415"
                mask="url(#prefix__b)"
            ></path>
            <path
                fill="#FEFEFE"
                d="M68.429 143.92l-12.895-18.242a1.628 1.628 0 01.39-2.267l8.526-6.025c8.822-6.238 14.088-14.889 14.088-27.212V34.637c0-.899.728-1.625 1.626-1.625h22.757v57.162c0 22.433-6.247 33.624-24.638 46.78l-9.854 6.965z"
            ></path>
            <g transform="translate(67 33)">
                <path
                    fill="url(#prefix__d)"
                    d="M35.247.012V56.22c0 22.434-6.248 33.624-24.638 46.779l-9.855 6.966 4.691 6.637a1.627 1.627 0 002.266.389l8.571-6.059c10.907-7.801 17.738-14.972 22.149-23.258C42.976 79.15 45 69.447 45 56.22V1.637C45 .74 44.271.012 43.374.012h-8.127z"
                    mask="url(#prefix__e)"
                ></path>
            </g>
        </g>
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
