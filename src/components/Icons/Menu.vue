<template>
    <svg :width="size" :height="size" fill="#0072FF" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path
            d="M 2 5 L 2 7 L 22 7 L 22 5 L 2 5 z M 2 11 L 2 13 L 22 13 L 22 11 L 2 11 z M 2 17 L 2 19 L 22 19 L 22 17 L 2 17 z"
        />
    </svg>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    props: {
        size: Number,
    },
})
export default class MenuIcon extends Vue {}
</script>

<style></style>
