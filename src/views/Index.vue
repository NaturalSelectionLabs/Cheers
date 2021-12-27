<template>
    <div class="onboarding flex items-center justify-center h-screen text-center bg-pass3gradient bg-cover bg-fixed">
        <div class="fixed top-0 flex px-14 py-2 w-full">
            <div class="h-18 flex items-center justify-start md:h-20">
                <!-- Site branding -->
                <div class="flex-shrink-0 mr-4">
                    <!-- Logo -->
                    <router-link to="/" class="block" aria-label="RSS3">
                        <Logo :size="35" />
                    </router-link>
                </div>
            </div>
            <nav class="hidden md:flex md:flex-grow">
                <!-- Desktop menu links -->
                <ul class="flex flex-row flex-grow flex-wrap gap-10 items-center justify-end">
                    <li>
                        <a
                            href="https://pass3.me"
                            class="nav-item hover:text-primary-text text-white text-lg font-medium"
                            >Twitter</a
                        >
                    </li>
                    <li>
                        <a
                            href="https://github.com/NaturalSelectionLabs"
                            class="nav-item hover:text-primary-text text-white text-lg font-medium"
                            >GitHub</a
                        >
                    </li>
                    <li>
                        <a
                            href="https://rss3.notion.site"
                            class="nav-item hover:text-primary-text text-white text-lg font-medium"
                            >Tutorials</a
                        >
                    </li>
                </ul>
            </nav>
        </div>
        <div class="body flex flex-col gap-10 items-center justify-between mt-5 px-4 h-3/4">
            <Logo :size="200" />
            <div class="flex flex-col gap-6 items-center mb-10">
                <h1 class="text-5xl font-medium md:text-6xl">
                    <span class="text-primary-text">Pass</span> is the LinkedIn of
                    <span class="text-primary-text">Web3</span>
                </h1>
                <span class="w-3/4 text-lg">
                    RSS3 Bio - You had personal websites in Web1, Twitter and Instagram Pages in Web2, and now RSS3 Bio
                    in Web3.
                </span>
                <div class="mt-5 mx-auto w-68 text-white text-2xl leading-17.5">
                    <Button
                        size="sm"
                        class="mb-6 w-full h-13 text-primary-btn-text bg-primary-btn shadow-primary-btn"
                        @click="walletConnect"
                    >
                        <WalletConnect :size="30" />
                        <span> Wallet Connect </span>
                    </Button>
                    <Button
                        size="sm"
                        class="w-full h-13 text-metamask-text bg-metamask-bg shadow-metamask"
                        v-show="isHavingMetamaskPlugin"
                        @click="metaMask"
                    >
                        <Metamask :size="30" />
                        <span> Metamask </span>
                    </Button>
                </div>
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
import ShadowLogo from '@/components/Icons/ShadowLogo.vue';
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
        ShadowLogo,
    },
})
export default class Index extends Vue {
    rss3: RSS3DetailPersona | null = null;
    isHavingMetamaskPlugin: Boolean = (window as any).ethereum;
    isLoading: Boolean = false;
    $gtag: any;

    async mounted() {
        if (RSS3.isValidRSS3()) {
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
        await RSS3.ensureLoginUser();
        const loginUser = RSS3.getLoginUser();
        try {
            profile = loginUser.profile;
            address = loginUser.address;
            console.log(profile);
        } catch (e) {
            console.log(e);
        }
        this.$gtag.config(address);

        const rns = loginUser.name;
        // Check if setup RNS
        if (!(await RNSUtils.addr2Name(loginUser.address, true)) && (await this.isPassEnough())) {
            // Setup RNS
            this.$gtag.event('rns', { userid: address });
            await this.$router.push('/rns');
        } else if (!loginUser.file?.signature) {
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
