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
                    <WalletConnect size="40" />
                    <span> Wallet Connect </span>
                </Button>
                <Button
                    size="lg"
                    class="text-metamask-text bg-metamask-bg shadow-metamask rounded-3xl w-full h-17.5"
                    v-show="isHavingMetamaskPlugin"
                    @click="metaMask"
                >
                    <Metamask size="40" />
                    <span> Metamask </span>
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
                        <i class="bx bx-loader-alt bx-spin"></i>
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
import { RSS3Profile } from 'rss3-next/types/rss3';
import RNSUtils from '@/common/rns';
import WalletConnect from '@/components/Icons/WalletConnect.vue';
import Metamask from '@/components/Icons/Metamask.vue';

@Options({
    components: {
        Metamask,
        WalletConnect,
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
            const redirectFrom = localStorage.getItem('redirectFrom');
            localStorage.removeItem('redirectFrom');
            await this.$router.push(redirectFrom || '/home');
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
        try {
            this.rss3 = await RSS3.metamaskConnect();
        } catch (e) {
            console.log(e);
            this.isLoading = false;
            this.$gtag.event('cancelLogin', { method: 'MetaMask' });
            return;
        }
        await this.verifyProfile();
    }

    async verifyProfile() {
        if (!this.rss3) {
            return;
        }
        // Check if setup RNS

        let profile;
        let address: string = '';
        try {
            profile = await this.rss3.profile.get();
            address = this.rss3.account.address;
            console.log(profile);
        } catch (e) {
            console.error(e);
        }
        if (profile) {
            this.$gtag.config(address);
            this.$gtag.event('login', { userid: address });
            const redirectFrom = localStorage.getItem('redirectFrom');
            localStorage.removeItem('redirectFrom');
            await this.$router.push(redirectFrom || '/home');
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
    }
}
</style>
