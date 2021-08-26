<template>
    <div class="onboarding h-full text-center bg-cover bg-fixed flex items-center justify-center">
        <div class="body h-2/3 flex flex-col justify-between">
            <h1 class="text-8xl text-primary font-bold">Hello</h1>
            <div class="leading-17.5 text-white w-83.5 text-2xl mx-auto">
                <Button
                    size="lg"
                    class="bg-primary shadow-primary rounded-3xl w-full h-17.5 mb-9"
                    @click="walletConnect"
                >
                    Connect A Wallet
                </Button>
                <Button
                    size="lg"
                    class="text-metamask-text bg-metamask-bg shadow-metamask rounded-3xl w-full h-17.5"
                    @click="metaMask"
                    >Metamask</Button
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
// import RSS3 from '@/common/rss3'

@Options({
    components: {
        Button,
    },
})
export default class Index extends Vue {
    async walletConnect() {}

    async metaMask() {}
}
</script>

<style lang="postcss" scoped>
.onboarding {
    background-image: url('../assets/images/rss3-bg.png');

    .body {
        .hello {
            text-shadow: 0 9px 35px #b7d7ff;
        }
    }
}
</style>
