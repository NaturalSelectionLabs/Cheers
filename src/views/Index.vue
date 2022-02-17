<template>
    <div class="onboarding flex h-screen items-center justify-center text-center">
        <div class="fixed top-0 flex w-full px-6 py-3 md:px-14 md:py-2">
            <div class="h-18 flex items-center justify-start md:h-20">
                <div class="mr-4 mt-2 shrink-0 md:mt-0">
                    <router-link to="/" class="block" aria-label="RSS3">
                        <Logo :size="65" />
                    </router-link>
                </div>
            </div>
            <nav class="hidden md:flex md:flex-grow">
                <!-- Desktop menu links -->
                <ul class="flex flex-grow flex-row flex-wrap items-center justify-end gap-10">
                    <li>
                        <a
                            href="https://twitter.com/rss3_"
                            class="font-base nav-item text-lg text-primary-btn hover:text-body-text"
                            >Twitter</a
                        >
                    </li>
                    <li>
                        <a
                            href="https://github.com/NaturalSelectionLabs"
                            class="font-base nav-item text-lg text-primary-btn hover:text-body-text"
                            >GitHub</a
                        >
                    </li>
                    <li>
                        <a
                            href="https://rss3.fun/"
                            class="font-base nav-item text-lg text-primary-btn hover:text-body-text"
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
                        class="z-100 absolute left-0 top-full h-screen w-full overflow-hidden bg-none"
                    >
                        <ul class="flex h-full flex-grow flex-col items-center justify-center gap-10 pb-40">
                            <li>
                                <a
                                    href="https://twitter.com/rss3_"
                                    class="font-base nav-item text-2xl text-body-text hover:text-primary-text"
                                    >Twitter</a
                                >
                            </li>
                            <li>
                                <a
                                    href="https://github.com/NaturalSelectionLabs"
                                    class="font-base nav-item text-2xl text-body-text hover:text-primary-text"
                                    >GitHub</a
                                >
                            </li>
                            <li>
                                <a
                                    href="https://rss3.fun/"
                                    class="font-base nav-item text-2xl text-body-text hover:text-primary-text"
                                    >Tutorials</a
                                >
                            </li>
                            <li>
                                <a
                                    href="https://rss3.io/#/privacy"
                                    class="font-base nav-item text-2xl text-body-text hover:text-primary-text"
                                    >Privacy policy</a
                                >
                            </li>
                        </ul>
                    </nav>
                </transition>
            </div>
        </div>

        <div v-show="!mobileNavOpen" class="z-1 body mt-24 flex h-3/4 flex-col items-center justify-center gap-10 px-4">
            <div class="mb-10 flex flex-col items-center gap-6">
                <Loading :size="200" :class="{ invisible: isLoading }" :isLooping="false" />
                <span class="mt-1 w-3/4 text-lg font-light md:mt-3 md:w-full md:text-2xl">
                    Your Web3 in one shot. <br />
                </span>
                <div
                    class="mx-auto mt-4 w-60 text-xl leading-17.5 text-white md:mt-8 md:flex md:w-full md:flex-row md:justify-center md:gap-6"
                >
                    <Button size="sm" class="mb-6 h-13 w-60 bg-card-bg text-walletConnect" @click="walletConnect">
                        <WalletConnect :size="30" />
                        <span> Wallet Connect </span>
                    </Button>
                    <Button
                        size="sm"
                        class="invisible h-13 w-60 bg-card-bg text-metamask-text md:visible"
                        v-show="isHavingMetamaskPlugin"
                        @click="metaMask"
                    >
                        <Metamask :size="30" />
                        <span> Metamask </span>
                    </Button>
                </div>
            </div>

            <LoadingContainer v-show="isLoading" :isLooping="true" />
        </div>
        <div v-show="!mobileNavOpen" class="fixed bottom-0 flex w-full justify-center px-14 py-2">
            <div class="flex h-10 items-center text-center md:h-10 md:justify-start">
                <span class="text-sm font-light text-black opacity-60">©2021 Natural Selection Labs</span>
            </div>
            <nav class="hidden md:flex md:flex-grow">
                <!-- Desktop menu links -->
                <ul class="flex flex-grow flex-row flex-wrap items-center justify-end gap-10">
                    <li>
                        <a
                            href="https://rss3.io/#/privacy"
                            class="nav-item text-sm font-light text-black opacity-60 hover:text-primary-text"
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
import MenuIcon from '@/components/Icons/Menu.vue';
import CloseIcon from '@/components/Icons/Close.vue';
import config from '@/config';
import utils from '@/common/utils';
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
        MenuIcon,
        CloseIcon,
    },
})
export default class Index extends Vue {
    rss3: RSS3DetailPersona | null = null;
    isHavingMetamaskPlugin: Boolean = (window as any).ethereum;
    isLoading: Boolean = false;
    mobileNavOpen: Boolean = false;
    top: Boolean = true;
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
            const redirectFrom = utils.getCrossDomainStorage('redirectFrom') || '';
            utils.setCrossDomainStorage('redirectFrom', '');
            if (redirectFrom && redirectFrom.includes(config.subDomain.rootDomain)) {
                window.location.href = redirectFrom;
            } else if (rns) {
                window.location.href = '//' + rns + '.' + config.subDomain.rootDomain + redirectFrom;
            } else {
                await this.$router.push(redirectFrom || `/${address}`);
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
.logo-container {
    mix-blend-mode: multiply;
}
</style>
