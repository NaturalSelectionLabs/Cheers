<template>
    <div class="h-screen text-body-text">
        <div class="flex items-center justify-center mx-auto w-full max-w-md h-full text-center">
            <div class="flex flex-col justify-between w-full h-2/3">
                <h1 class="text-6xl font-bold">Claim your RNS</h1>
                <div class="input-rns">
                    <span
                        class="flex mb-2 px-2 w-full text-left text-lg font-normal opacity-0"
                        :class="{ 'text-error': isErrorNotice, 'opacity-100': notice !== '' }"
                    >
                        <i class="bx mr-2 text-xl" :class="{ 'bxs-x-circle': isErrorNotice }" />
                        <span>
                            {{ notice }}
                        </span>
                    </span>
                    <Input
                        class="mb-4 w-full text-xl"
                        :is-single-line="true"
                        placeholder="Enter an RNS"
                        :is-error="notice !== ''"
                        v-model="rns"
                        @keyup.enter.native="verifyRNS"
                        :is-disabled="isWithoutMetamask || isAlreadyHavingRNS"
                        :suffix="rnsSuffix"
                    />
                    <span class="flex px-2 w-full text-left">
                        <i class="bx bx-info-circle mr-2 text-gray-400 text-lg" />
                        <span class="text-primary-text"> An RNS is a unique domain for a Web 3 Pass by RSS3 </span>
                    </span>
                    <span class="flex px-2 w-full text-left">
                        <i class="bx bx-info-circle mr-2 text-gray-400 text-lg" />
                        <span class="text-primary-text"> You can also set it up later in your profile </span>
                    </span>
                </div>
                <div>
                    <div class="flex gap-5 m-auto px-4 py-4 w-full">
                        <Button size="lg" class="text-secondary-btn-text flex-1 text-lg bg-secondary-btn" @click="skip"
                            >Skip</Button
                        >
                        <Button size="lg" class="flex-1 text-body-text text-lg bg-primary-btn" @click="verifyRNS"
                            >Go</Button
                        >
                    </div>
                </div>
            </div>
            <LoadingContainer v-show="isLoading" />

            <Modal v-if="isShowingConfirm">
                <template #header>
                    <h1>Confirm your RNS</h1>
                </template>
                <template #body>
                    <p class="mt-6">
                        Your
                        <span class="text-primary-text">RNS</span>
                        will be
                    </p>
                    <h2 class="my-6 px-4 py-2 text-primary-text text-4xl select-all overflow-y-auto">
                        {{ rns }}
                    </h2>
                    <p>is that right?</p>
                </template>
                <template #footer>
                    <div class="flex flex-row gap-5">
                        <Button size="sm" class="w-32" @click="isShowingConfirm = false"> No </Button>
                        <Button size="sm" class="w-32 text-body-text bg-primary-btn" @click="confirm"> Yes </Button>
                    </div>
                </template>
            </Modal>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import RSS3 from '@/common/rss3';
import RNSUtils from '@/common/rns';
import Modal from '@/components/Common/Modal.vue';
import Input from '@/components/Input/Input.vue';
import Loading from '@/components/Loading/Loading.vue';
import LoadingContainer from '@/components/Loading/LoadingContainer.vue';
import config from '@/config';
import { routes } from '@/router';
import utils from '@/common/utils';
@Options({
    name: 'RNS',
    components: {
        Input,
        Modal,
        Button,
        Loading,
        LoadingContainer,
    },
})
export default class RNS extends Vue {
    ethAddress: string = '';
    rns: string = '';
    notice: String = '';
    isErrorNotice: Boolean = true;
    isLoading: Boolean = false;
    isShowingConfirm: Boolean = false;
    isWithoutMetamask: boolean = false;
    isAlreadyHavingRNS: boolean = false;
    rnsSuffix: string = '.' + config.subDomain.rootDomain;
    $gtag: any;

    async validateNetwork(chain: number | null) {
        try {
            if (config.rns.test && chain !== 0x3) {
                await (window as any).ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x3' }],
                });
            } else if (!config.rns.test && chain !== 0x1) {
                await (window as any).ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x1' }],
                });
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    async skipRedirect() {
        // Login
        const redirectFrom = sessionStorage.getItem('redirectFrom');
        sessionStorage.removeItem('redirectFrom');
        if (this.isAlreadyHavingRNS) {
            window.location.href = '//' + this.rns + '.' + config.subDomain.rootDomain + (redirectFrom || '');
        } else {
            await this.$router.push(redirectFrom || `/${this.ethAddress}`);
        }
    }

    async refreshAccount() {
        if (!RSS3.isValidRSS3()) {
            sessionStorage.setItem('redirectFrom', this.$route.fullPath);
            await this.$router.push('/');
        } else {
            const loginUser = await RSS3.getLoginUser();
            const metamaskEthereum = (window as any).ethereum;
            // this.rss3 object exists, don't necessarily mean the account is connected
            await metamaskEthereum.request({
                method: 'eth_requestAccounts',
            });
            this.ethAddress = loginUser.address;
            const chain: string | null = await metamaskEthereum.request({ method: 'eth_chainId' });
            if (await this.validateNetwork(Number(chain))) {
                const rns = await RNSUtils.addr2Name(this.ethAddress, true);
                if (rns !== '') {
                    this.rns = rns.replace('.rss3', '').toLowerCase();
                    this.isAlreadyHavingRNS = true;
                }
            }
        }
    }

    async mounted() {
        await utils.tryEnsureOrRedirect(this.$route, this.$router);
        await this.refreshAccount();
    }

    async back() {
        this.$gtag.event('cancelSetupRNS', { userid: RSS3.getLoginUser().address });
        window.history.back();
    }

    async skip() {
        await this.skipRedirect();
    }

    async isPassEnough(): Promise<boolean> {
        const passBalance = await RNSUtils.balanceOfPass3(RSS3.getLoginUser().address);
        console.log('Your $PASS: ', passBalance);
        return passBalance >= 1;
    }

    async verifyRNS() {
        if (this.isAlreadyHavingRNS) {
            await this.skipRedirect();
            return;
        }
        if (!(window as any).ethereum) {
            this.notice = 'You need MetaMask extension to sign';
            this.isWithoutMetamask = true;
            return;
        }
        this.isLoading = true;
        await this.refreshAccount();
        this.rns = this.rns.toLowerCase();
        for (const r of routes) {
            if (`/${this.rns}` === r?.path) {
                this.notice = 'Sorry, but this RNS is conflict with Routes and thus will not work properly.';
                this.isLoading = false;
                return;
            }
        }
        if (this.rns.length < 5 || this.rns.length >= 15) {
            this.notice = 'An RNS must have at least 5 characters and no more than 15';
        } else if (!/^[a-z0-9\-_]+$/.test(this.rns)) {
            this.notice = 'An RNS should only contain lower case letters, numbers, minus and underlines.';
        } else if (this.rns.startsWith('0x')) {
            this.notice = 'An RNS should not start with "0x".';
        } else if (!(await this.isPassEnough())) {
            // Check $PASS balance
            this.notice = 'Sorry, but you need 1 $PASS to register an RNS';
        } else if (parseInt(await RNSUtils.name2Addr(this.rns)) !== 0) {
            // Already taken
            this.notice = 'Sorry, but this RNS has already been taken.';
        } else {
            this.isShowingConfirm = true;
            this.notice = '';
        }
        this.isLoading = false;
    }

    async confirm() {
        await RNSUtils.register(this.rns);
        this.isShowingConfirm = false;
        await this.$router.push('/pending');
    }
}
</script>

<style lang="postcss" scoped></style>
