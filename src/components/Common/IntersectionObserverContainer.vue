<template>
    <div class="intersection-observer" ref="observer">
        <slot />
    </div>
</template>
<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue';

export default defineComponent({
    name: 'IntersectionObserverContainer',
    props: {
        once: Boolean,
        enabled: Boolean,
    },
    emits: ['trigger'],

    setup(props, context) {
        const observer = ref(null);

        onMounted(() => {
            // Check if running in browser
            const runningOnBrowser = typeof window !== 'undefined';
            // Match spiders
            const isBot =
                (runningOnBrowser && !('onscroll' in window)) ||
                (typeof navigator !== 'undefined' &&
                    /(gle|ing|ro|msn)bot|crawl|spider|yand|duckgo/i.test(navigator.userAgent));
            // Check if browser supports IntersectionObserver API
            const supportsIntersectionObserver = runningOnBrowser && 'IntersectionObserver' in window;

            if (runningOnBrowser && !isBot && supportsIntersectionObserver && observer.value) {
                const IObserver = new IntersectionObserver(
                    async (entries) => {
                        if (entries[0].isIntersecting) {
                            if (props.enabled) {
                                await trigger();
                                if (props.once) {
                                    IObserver.disconnect();
                                }
                            }
                        }
                    },
                    { threshold: 0 },
                );
                IObserver.observe(observer.value);
            }
        });

        function trigger() {
            context.emit('trigger');
        }

        return {
            observer,
        };
    },
});
</script>
