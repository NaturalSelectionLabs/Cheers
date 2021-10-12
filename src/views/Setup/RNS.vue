<template>
    <div class="rns">
        <div class="page">
            <h1 class="title">Claim your RNS</h1>
            <div class="input-rns">
                <span class="notice" :class="{ error: isErrorNotice, show: notice !== '' }">
                    <i class="bx" :class="{ 'bxs-x-circle': isErrorNotice }" />
                    <span>
                        {{ notice }}
                    </span>
                </span>
                <Input
                    class="input"
                    :is-single-line="true"
                    placeholder="Enter an RNS"
                    :is-error="notice !== ''"
                    v-model="rns"
                    @keyup.enter.native="verifyRNS"
                    :is-disabled="isDisabled"
                    :suffix="rnsSuffix"
                />
                <span class="about">
                    <i class="bx bx-info-circle" />
                    <span> An RNS is a unique domain for a Web 3 Pass by RSS3 </span>
                </span>
                <span class="about">
                    <i class="bx bx-info-circle" />
                    <span> You can also set it up later in your profile </span>
                </span>
            </div>
            <div class="nav">
                <div class="px-4 py-4 flex gap-5 m-auto w-full">
                    <Button
                        size="lg"
                        class="flex-1 text-lg bg-secondary-btn text-secondary-btn-text shadow-secondary-btn"
                        @click="skip"
                        >Skip</Button
                    >
                    <Button
                        size="lg"
                        class="flex-1 text-lg bg-primary-btn text-primary-btn-text shadow-primary-btn"
                        @click="verifyRNS"
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
                <h2 class="text-4xl my-6 px-4 py-2 text-primary-text overflow-y-auto select-all">
                    {{ rns }}
                </h2>
                <p>is that right?</p>
            </template>
            <template #footer>
                <div class="flex flex-row gap-5">
                    <Button
                        size="sm"
                        class="w-32 bg-secondary-btn text-secondary-btn-text shadow-secondary-btn"
                        @click="isShowingConfirm = false"
                    >
                        No
                    </Button>
                    <Button
                        size="sm"
                        class="w-32 bg-primary-btn text-primary-btn-text shadow-primary-btn"
                        @click="confirm"
                    >
                        Yes
                    </Button>
                </div>
            </template>
        </Modal>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import RSS3, { IRSS3 } from '@/common/rss3';
import RNSUtils from '@/common/rns';
import Modal from '@/components/Modal.vue';
import Input from '@/components/Input.vue';
import Loading from '@/components/Loading.vue';
import LoadingContainer from '@/components/LoadingContainer.vue';
import config from '@/config';
import { routes } from '@/router';
function validateNetwork(chain: number | null, cb?: (chain: number | null) => void) {
    if (config.rns.test && chain !== 0x3) {
        alert('Please switch to ropsten network.');
        cb ? cb(chain) : '';
        return false;
    } else if (!config.rns.test && chain !== 0x1) {
        alert('Please switch to mainnet network.');
        cb ? cb(chain) : '';
        return false;
    }
    return true;
}
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
    rss3: IRSS3 | null = null;
    ethAddress: string = '';
    rns: string = '';
    notice: String = '';
    isErrorNotice: Boolean = true;
    isLoading: Boolean = false;
    isShowingConfirm: Boolean = false;
    isDisabled: Boolean = false;
    rnsSuffix: string = '.rss3';
    $gtag: any;

    async redirect() {
        // Login
        const redirectFrom = sessionStorage.getItem('redirectFrom');
        sessionStorage.removeItem('redirectFrom');
        if (this.rns) {
            window.location.href = '//' + this.rns + '.' + config.subDomain.rootDomain + (redirectFrom || '');
        } else {
            await this.$router.push(redirectFrom || `/${this.rns || this.ethAddress}`);
        }
    }

    async refreshAccount() {
        if (!(await RSS3.reconnect())) {
            sessionStorage.setItem('redirectFrom', this.$route.fullPath);
            await this.$router.push('/');
        } else {
            this.rss3 = await RSS3.get();
            const metamaskEthereum = (window as any).ethereum;
            // this.rss3 object exists, don't necessarily mean the account is connected
            await metamaskEthereum.request({
                method: 'eth_requestAccounts',
            });
            this.ethAddress = (<IRSS3>this.rss3).account.address;
            const chain: string | null = await metamaskEthereum.request({ method: 'eth_chainId' });
            if (validateNetwork(Number(chain))) {
                const rns = (await RNSUtils.addr2Name(this.ethAddress)).replace(config.rns.suffix, '');
                if (rns !== '') {
                    this.rns = rns;
                    this.isDisabled = true;
                }
            }
        }
    }

    async mounted() {
        await this.refreshAccount();
    }

    async back() {
        this.$gtag.event('cancelSetupRNS', { userid: (<IRSS3>this.rss3).account.address });
        window.history.back();
    }

    async skip() {
        await this.redirect();
    }

    async isPassEnough(): Promise<boolean> {
        const passBalance = await RNSUtils.balanceOfPass3((<IRSS3>this.rss3).account.address);
        console.log('Your $PASS: ', passBalance);
        return passBalance >= 1;
    }

    async verifyRNS() {
        if (this.rns) {
            await this.redirect();
            return;
        }
        if (!(window as any).ethereum) {
            this.notice = 'You need MetaMask extension to sign';
            this.isDisabled = true;
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
        } else if (parseInt(await RNSUtils.name2Addr(this.rns + config.rns.suffix)) !== 0) {
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

<style lang="postcss" scoped>
@layer components {
    .rns {
        @apply h-full w-full max-w-md mx-auto text-center flex items-center justify-center;

        .page {
            @apply h-2/3 flex flex-col justify-between w-full;

            .title {
                @apply text-6xl text-primary-text font-bold;
            }

            .input-rns {
                .notice {
                    @apply flex w-full text-left px-2 text-lg font-normal mb-2 opacity-0;
                    > i {
                        @apply mr-2 text-xl;
                    }
                    &.error {
                        @apply text-error;
                    }
                    &.show {
                        @apply opacity-100;
                    }
                }

                .input {
                    @apply mb-4 w-full text-xl;
                }

                .about {
                    @apply flex w-full text-left px-2;
                    > i {
                        @apply mr-2 text-lg text-gray-400;
                    }
                    > span {
                        @apply text-primary-text;
                    }
                }
            }
        }
    }
}
</style>
