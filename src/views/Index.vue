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
                    Wallet Connect
                </Button>
                <Button
                    size="lg"
                    class="text-metamask-text bg-metamask-bg shadow-metamask rounded-3xl w-full h-17.5"
                    v-show="isHavingMetamaskPlugin"
                    @click="metaMask"
                >
                    Metamask
                </Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import RSS3, { IRSS3 } from '@/common/rss3';

@Options({
    components: {
        Button,
    },
})
export default class Index extends Vue {
    rss3: IRSS3 | null = null;
    isHavingMetamaskPlugin: Boolean = (window as any).ethereum;

    async walletConnect() {
        this.rss3 = await RSS3.walletConnect();
        await this.verifyProfile();
    }

    async metaMask() {
        this.rss3 = await RSS3.metamaskConnect();
        await this.verifyProfile();
    }

    async verifyProfile() {
        if (!this.rss3) {
            return;
        }
        let profile;
        try {
            profile = await this.rss3.profile.get();
            console.log(profile);
        } catch (e) {
            console.error(e);
        }
        if (profile) {
            // this.$gtag.config(rss3.account.address)
            // this.$gtag.event('login', { userid: rss3.account.address, event_label: rss3.account.address })
            await this.$router.push('/public');
        } else {
            // this.$gtag.config(rss3.account.address)
            // this.$gtag.event('sign_up', { userid: rss3.account.address, event_label: rss3.account.address })
            await this.$router.push('/setup');
        }
    }
}
</script>

<style lang="postcss" scoped>
@layer components {
    .onboarding {
        background-image: url('../assets/images/rss3-bg.png');
        .body {
            .hello {
                text-shadow: 0 9px 35px #b7d7ff;
            }

            .connect {
                box-shadow: 0px 9px 35px -7px rgba(0, 114, 255, 0.94);
            }

            .metamask {
                background: #fff4eb;
                box-shadow: 0px 8px 12px 5px rgba(246, 133, 27, 0.18);
                color: #944300;
            }
        }
    }
}
</style>
