<template></template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import confetti from 'canvas-confetti';
export default class Confetii extends Vue {
    mounted() {
        var end = Date.now() + 3.5 * 1000;
        // cheers!
        var colors = ['#ED7F55', '#FED581'];

        (function frame() {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors,
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors,
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    }
}
</script>

<style></style>
