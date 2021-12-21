<template>
    <div class="onboarding flex items-center justify-center h-screen text-center bg-pass3gradient bg-cover bg-fixed">
        <div class="body flex flex-col items-center justify-between px-4 h-2/3">
            <Logo :size="200" />
            <div class="mx-auto w-83.5 text-white text-2xl leading-17.5">
                <Button
                    size="lg"
                    class="mb-9 w-full h-17.5 text-primary-btn-text bg-primary-btn rounded-3xl shadow-primary-btn"
                    @click="walletConnect"
                >
                    <WalletConnect :size="40" />
                    <span> Wallet Connect </span>
                </Button>
                <Button
                    size="lg"
                    class="w-full h-17.5 text-metamask-text bg-metamask-bg rounded-3xl shadow-metamask"
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
import Button from '@/components/Button/Button.vue';
import RSS3, { IRSS3, RSS3DetailPersona } from '@/common/rss3';
import Modal from '@/components/Common/Modal.vue';
import RNSUtils from '@/common/rns';
import WalletConnect from '@/components/Icons/WalletConnect.vue';
import Metamask from '@/components/Icons/Metamask.vue';
import Loading from '@/components/Loading/Loading.vue';
import LoadingContainer from '@/components/Loading/LoadingContainer.vue';
import Logo from '@/components/Icons/Logo.vue';
import config from '@/config';
@Options({
    name: 'Index',
    components: {
        Metamask,
        WalletConnect,
        Modal,
        Button,
        Loading,
        LoadingContainer,
        Logo,
    },
})
export default class Index extends Vue {
    rss3: RSS3DetailPersona | null = null;
    isHavingMetamaskPlugin: Boolean = (window as any).ethereum;
    isLoading: Boolean = false;
    $gtag: any;

    async mounted() {
        if (RSS3.getLoginUser().persona || (await RSS3.reconnect())) {
            this.rss3 = RSS3.getLoginUser();
            await this.initRedirect();
        }
    }

    async isPassEnough(): Promise<boolean> {
        // remove RNS setup
        // const passBalance = await RNSUtils.balanceOfPass3(RSS3.getLoginUser().address);
        // console.log('Your $PASS: ', passBalance);
        return false;
    }

    async initRedirect() {
        this.isLoading = true;
        let profile: RSS3Profile | null = null;
        let address: string = '';
        try {
            const RSS3LoginUser = RSS3.getLoginUser();
            profile = RSS3LoginUser.profile;
            address = RSS3LoginUser.address;
            console.log(profile);
        } catch (e) {
            console.log(e);
        }
        this.$gtag.config(address);

        const rns = await RNSUtils.addr2Name(address);
        // Check if setup RNS
        if (rns === '' && (await this.isPassEnough())) {
            // Setup RNS
            this.$gtag.event('rns', { userid: address });
            await this.$router.push('/rns');
        } else if (!(profile?.name || profile?.bio || profile?.avatar)) {
            // Setup Profile
            this.$gtag.event('sign_up', { userid: address });
            await this.$router.push('/setup');
        } else {
            // Login
            this.$gtag.event('login', { userid: address });
            const redirectFrom = sessionStorage.getItem('redirectFrom') || '';
            sessionStorage.removeItem('redirectFrom');
            if (rns) {
                window.location.href = '//' + rns + '.' + config.subDomain.rootDomain + redirectFrom;
            } else {
                await this.$router.push(redirectFrom || `/${rns || address}`);
            }
        }
        this.isLoading = false;
    }

    async walletConnect() {
        this.$gtag.event('loginWallet', { method: 'WalletConnect' });
        try {
            this.rss3 = await RSS3.connect.walletConnect();
        } catch (e) {
            return null;
        }

        await this.verifyProfile();
    }

    async metaMask() {
        this.$gtag.event('loginWallet', { method: 'MetaMask' });
        this.isLoading = true;
        try {
            this.rss3 = await RSS3.connect.metamask();
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
