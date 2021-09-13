<template>
    <div class="onboarding h-full text-center bg-cover bg-fixed flex items-center justify-center bg-pass3gradient">
        <div class="body px-4 h-2/3 flex flex-col justify-start items-center gap-56">
            <div class="logo-container w-50 h-50 bg-pass3logo bg-center bg-contain bg-no-repeat"></div>
            <div class="leading-17.5 text-white w-83.5 text-2xl mx-auto">
                <Button
                    size="lg"
                    class="bg-primary-btn shadow-primary-btn text-primary-btn-text rounded-3xl w-full h-17.5 mb-9"
                    @click="walletConnect"
                >
                    <WalletConnect :size="40" />
                    <span> Wallet Connect </span>
                </Button>
                <Button
                    size="lg"
                    class="text-metamask-text bg-metamask-bg shadow-metamask rounded-3xl w-full h-17.5"
                    v-show="isHavingMetamaskPlugin"
                    @click="metaMask"
                >
                    <Metamask :size="40" />
                    <span> Metamask </span>
                </Button>
            </div>
            <LoadingContainer v-show="isLoading" />
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
import Loading from '@/components/Loading.vue';
import LoadingContainer from '@/components/LoadingContainer.vue';
@Options({
    components: {
        Metamask,
        WalletConnect,
        Modal,
        Button,
        Loading,
        LoadingContainer,
    },
})
export default class Index extends Vue {
    rss3: IRSS3 | null = null;
    isHavingMetamaskPlugin: Boolean = (window as any).ethereum;
    isLoading: Boolean = false;
    $gtag: any;

    async mounted() {
        if (await RSS3.reconnect()) {
            this.rss3 = await RSS3.get();
            await this.initRedirect();
        }
    }

    async initRedirect() {
        let profile: RSS3Profile | null = null;
        let address: string = '';
        try {
            profile = await (<IRSS3>this.rss3).profile.get();
            address = (<IRSS3>this.rss3).account.address;
            console.log(profile);
        } catch (e) {
            console.log(e);
        }
        this.$gtag.config(address);

        // Check if setup RNS
        if ((await RNSUtils.addr2Name(address)) === '') {
            // Setup RNS
            // this.$gtag.event('rns', { userid: address });
            await (<IRSS3>this.rss3).files.sync();
            await this.$router.push('/rns');
        } else if (!profile) {
            // Setup Profile
            await (<IRSS3>this.rss3).files.sync();
            this.$gtag.event('sign_up', { userid: address });
            await this.$router.push('/setup');
        } else {
            // Login
            this.$gtag.event('login', { userid: address });
            const redirectFrom = sessionStorage.getItem('redirectFrom');
            sessionStorage.removeItem('redirectFrom');
            await this.$router.push(redirectFrom || '/home');
        }
    }

    async walletConnect() {
        this.$gtag.event('loginWallet', { method: 'WalletConnect' });
        try {
            this.rss3 = await RSS3.walletConnect();
        } catch (e) {
            return null;
        }

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
        if (this.rss3) {
            await this.initRedirect();
        }
    }
}
</script>

<style lang="postcss" scoped>
@layer components {
    .logo-container {
        mix-blend-mode: multiply;
    }
}
</style>
