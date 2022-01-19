<template>
    <div
        class="
            onboarding
            flex
            items-center
            justify-center
            h-screen
            text-center
            bg-body-bg bg-gradient-to-tr bg-cover bg-fixed
            from-blue-400
            to-blue-200
            via-blue-100
        "
    >
        <div class="fixed top-0 flex px-6 py-3 w-full md:px-14 md:py-2">
            <div class="h-18 flex items-center justify-start md:h-20">
                <div class="flex-shrink-0 mr-4 mt-2 md:mt-0">
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
                            href="https://twitter.com/rss3_"
                            class="font-base nav-item text-primary-text hover:text-white text-lg"
                            >Twitter</a
                        >
                    </li>
                    <li>
                        <a
                            href="https://github.com/NaturalSelectionLabs"
                            class="font-base nav-item text-primary-text hover:text-white text-lg"
                            >GitHub</a
                        >
                    </li>
                    <li>
                        <a
                            href="https://rss3.fun/"
                            class="font-base nav-item text-primary-text hover:text-white text-lg"
                            >Tutorials</a
                        >
                    </li>
                </ul>
            </nav>
            <!-- Mobile menu -->
            <div class="flex flex-grow justify-end md:hidden">
                <!-- Hamburger button -->
                <button
                    class="hamburger text-primary"
                    ref="hamburger"
                    :class="{ active: mobileNavOpen }"
                    @click="mobileNavOpen = !mobileNavOpen"
                >
                    <MenuIcon :size="30" v-show="!mobileNavOpen" />
                    <CloseIcon :size="30" v-show="mobileNavOpen" />
                </button>

                <!-- Mobile navigation -->
                <transition
                    enter-active-class="transition duration-200 ease-out transform"
                    enter-from-class="-translate-y-2 opacity-0"
                    enter-to-class="translate-y-0 opacity-100"
                    leave-active-class="transition duration-200 ease-out"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                >
                    <nav
                        id="mobile-nav"
                        ref="mobileNav"
                        v-show="mobileNavOpen"
                        class="z-100 absolute left-0 top-full w-full h-screen bg-none overflow-hidden"
                    >
                        <ul class="flex flex-col flex-grow gap-10 items-center justify-center pb-40 h-full">
                            <li>
                                <a
                                    href="https://twitter.com/rss3_"
                                    class="font-base nav-item text-primary-text hover:text-white text-2xl"
                                    >Twitter</a
                                >
                            </li>
                            <li>
                                <a
                                    href="https://github.com/NaturalSelectionLabs"
                                    class="font-base nav-item text-primary-text hover:text-white text-2xl"
                                    >GitHub</a
                                >
                            </li>
                            <li>
                                <a
                                    href="https://rss3.fun/"
                                    class="font-base nav-item text-primary-text hover:text-white text-2xl"
                                    >Tutorials</a
                                >
                            </li>
                            <li>
                                <a
                                    href="https://rss3.io/#/privacy"
                                    class="font-base nav-item text-primary-text hover:text-white text-2xl"
                                    >Privacy policy</a
                                >
                            </li>
                        </ul>
                    </nav>
                </transition>
            </div>
        </div>

        <div v-show="!mobileNavOpen" class="z-1 body flex flex-col gap-10 items-center justify-center mt-24 px-4 h-3/4">
            <div class="flex flex-col gap-6 items-center mb-10">
                <h1 class="text-6xl font-medium md:text-7xl">
                    <span class="text-primary-text">Pass</span> is the LinkedIn of
                    <span class="text-primary-text">Web3</span>
                </h1>
                <span class="mt-1 w-3/4 text-lg font-light md:mt-3 md:text-2xl">
                    Your Web3 activites and contents all in one place. <br />
                    Made for Web3, made for you.
                </span>
                <div
                    class="
                        mt-4
                        mx-auto
                        w-60
                        text-white text-xl
                        leading-17.5
                        md:flex md:flex-row md:gap-6 md:justify-center md:mt-8 md:w-full
                    "
                >
                    <Button
                        size="sm"
                        class="mb-6 w-60 h-13 text-primary-text bg-white bg-opacity-50"
                        @click="walletConnect"
                    >
                        <WalletConnect :size="30" />
                        <span> Wallet Connect </span>
                    </Button>
                    <Button
                        size="sm"
                        class="w-60 h-13 text-metamask-text bg-white bg-opacity-50 invisible md:visible"
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
        <div v-show="!mobileNavOpen" class="fixed bottom-0 flex justify-center px-14 py-2 w-full">
            <div class="flex items-center h-10 text-center md:justify-start md:h-10">
                <span class="text-black text-sm font-light opacity-60">©2021 Natural Selection Labs</span>
            </div>
            <nav class="hidden md:flex md:flex-grow">
                <!-- Desktop menu links -->
                <ul class="flex flex-row flex-grow flex-wrap gap-10 items-center justify-end">
                    <li>
                        <a
                            href="https://rss3.io/#/privacy"
                            class="nav-item text-black hover:text-primary-text text-sm font-light opacity-60"
                            >Privacy policy</a
                        >
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import RSS3, { RSS3DetailPersona } from '@/common/rss3';
import Modal from '@/components/Common/Modal.vue';
import RNSUtils from '@/common/rns';
import WalletConnect from '@/components/Icons/WalletConnect.vue';
import Metamask from '@/components/Icons/Metamask.vue';
import Loading from '@/components/Loading/Loading.vue';
import LoadingContainer from '@/components/Loading/LoadingContainer.vue';
import Logo from '@/components/Icons/Logo.vue';
import ShadowLogo from '@/components/Icons/ShadowLogo.vue';
import MenuIcon from '@/components/Icons/Menu.vue';
import CloseIcon from '@/components/Icons/Close.vue';
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
        MenuIcon,
        CloseIcon,
    },
    data() {
        return {
            mobileNavOpen: false,
            top: true,
        };
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
        const passBalance = await RNSUtils.balanceOfPass3(RSS3.getLoginUser().address);
        console.log('Your $PASS: ', passBalance);
        return passBalance >= 1;
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
