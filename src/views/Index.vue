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
            <Modal v-show="isLoading">
                <template #body>
                    <span
                        class="
                            text-9xl text-primary
                            opacity-50
                            block
                            absolute
                            top-1/2
                            left-1/2
                            transform
                            -translate-x-1/2 -translate-y-1/2
                        "
                    >
                        <i class="bx bx-sync bx-spin" />
                    </span>
                </template>
            </Modal>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import RSS3, { IRSS3 } from '@/common/rss3';
import Modal from '@/components/Modal.vue';

@Options({
    components: {
        Modal,
        Button,
    },
})
export default class Index extends Vue {
    rss3: IRSS3 | null = null;
    isHavingMetamaskPlugin: Boolean = (window as any).ethereum;
    isLoading: Boolean = false;
    $gtag: any;

    async mounted() {
        if (await RSS3.reconnect()) {
            await this.$router.push('/public');
        }
    }

    async walletConnect() {
        this.$gtag.event('loginWallet', { method: 'WalletConnect' });
        this.rss3 = await RSS3.walletConnect();
        await this.verifyProfile();
    }

    async metaMask() {
        this.$gtag.event('loginWallet', { method: 'MetaMask' });
        this.isLoading = true;
        this.rss3 = await RSS3.metamaskConnect();
        await this.verifyProfile();
    }

    async verifyProfile() {
        if (!this.rss3) {
            return;
        }
        let profile;
        let address;
        try {
            profile = await this.rss3.profile.get();
            address = await this.rss3.account.address;
            console.log(profile);
        } catch (e) {
            console.error(e);
        }
        if (profile) {
            this.$gtag.config(address);
            this.$gtag.event('login', { userid: address });
            await this.$router.push('/public');
        } else {
            this.$gtag.config(address);
            this.$gtag.event('sign_up', { userid: address });
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
