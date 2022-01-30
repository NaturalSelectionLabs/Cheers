<template></template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import confetti from 'canvas-confetti';
@Options({
    props: {
        isPCLayout: Boolean,
    },
})
export default class Confetii extends Vue {
    isPCLayout!: boolean;

    mounted() {
        var end = Date.now() + 3.5 * 1000;
        // cheers!
        var colors = ['#ED7F55', '#FED581'];

        if (this.isPCLayout) {
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
        } else {
            var count = 200;
            var defaults = {
                origin: { y: 0.7 },
                colors: colors,
            };
            function fire(particleRatio, opts) {
                confetti(
                    Object.assign({}, defaults, opts, {
                        particleCount: Math.floor(count * particleRatio),
                    }),
                );
            }

            fire(0.25, {
                spread: 26,
                startVelocity: 55,
            });
            fire(0.2, {
                spread: 60,
            });
            fire(0.35, {
                spread: 100,
                decay: 0.91,
                scalar: 0.8,
            });
            fire(0.1, {
                spread: 120,
                startVelocity: 25,
                decay: 0.92,
                scalar: 1.2,
            });
            fire(0.1, {
                spread: 120,
                startVelocity: 45,
            });
        }
    }
}
</script>

<style></style>
