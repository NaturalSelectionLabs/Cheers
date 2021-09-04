<template>
    <div class="rns">
        <div class="page">
            <h1 class="title">Onboard</h1>
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
                />
                <span class="about">
                    <i class="bx bx-info-circle" />
                    <span> An RNS is a unique domain for a Web 3 Pass by RSS3 </span>
                </span>
            </div>
            <div class="nav">
                <div class="px-4 py-4 flex gap-5 m-auto w-full">
                    <Button size="lg" class="flex-1 text-lg bg-white text-primary shadow-secondary" @click="back"
                        >Back</Button
                    >
                    <Button size="lg" class="flex-1 text-lg bg-primary text-white shadow-primary" @click="verifyRNS"
                        >Go</Button
                    >
                </div>
            </div>
        </div>
        <!-- <Modal v-show="isLoading">
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
        </Modal> -->
        <div
            v-show="isLoading"
            class="fixed w-screen h-screen m-0 p-0 top-0 left-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
            <Loading :size="200" />
        </div>
        <Modal v-if="isShowingConfirm">
            <template #header>
                <h1>Confirm your RNS</h1>
            </template>
            <template #body>
                <p class="mt-6">
                    Your
                    <span class="text-primary">RNS</span>
                    will be
                </p>
                <h2 class="text-4xl my-6 px-4 py-2 text-primary overflow-y-auto select-all">
                    {{ rns }}
                </h2>
                <p>is that right?</p>
            </template>
            <template #footer>
                <div class="flex flex-row gap-5">
                    <Button
                        size="sm"
                        class="w-32 bg-white text-primary shadow-secondary"
                        @click="isShowingConfirm = false"
                    >
                        No
                    </Button>
                    <Button size="sm" class="w-32 bg-primary text-white shadow-primary" @click="confirm"> Yes </Button>
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
@Options({
    components: {
        Input,
        Modal,
        Button,
        Loading,
    },
})
export default class RNS extends Vue {
    rss3: IRSS3 | null = null;
    rns: string = '';
    notice: String = '';
    isErrorNotice: Boolean = true;
    isLoading: Boolean = false;
    isShowingConfirm: Boolean = false;
    $gtag: any;

    async mounted() {
        // console.log('atlas addr:', await RNSUtils.name2Addr('atlas.pass3.me'));
        // console.log('rss3 addr:', await RNSUtils.name2Addr('rss3.pass3.me'));
        // console.log(
        //     'name of 0x8c23B96f2fb77AaE1ac2832debEE30f09da7af3C:',
        //     await RNSUtils.addr2Name('0x8c23B96f2fb77AaE1ac2832debEE30f09da7af3C'),
        // );
        // console.log('hanabi addr:', await RNSUtils.name2Addr('hanabi.pass3.me'));
        // console.log(
        //     'name of 0xc560eb6fd0c2eb80Df50E5e06715295AE1205049:',
        //     await RNSUtils.addr2Name('0xc560eb6fd0c2eb80Df50E5e06715295AE1205049'),
        // );
        // console.log('Balance of PASS3:', await RNSUtils.balanceOfPass3('0x8c23B96f2fb77AaE1ac2832debEE30f09da7af3C'));
        if (!(await RSS3.reconnect())) {
            sessionStorage.setItem('redirectFrom', this.$route.fullPath);
            await this.$router.push('/');
        } else {
            this.rss3 = await RSS3.get();
            if ((await RNSUtils.addr2Name((<IRSS3>this.rss3).account.address)).toString() !== '') {
                // Already setup RNS
                const profile = await (<IRSS3>this.rss3).profile.get();
                if (!profile) {
                    // Setup Profile
                    await (<IRSS3>this.rss3).files.sync();
                    this.$gtag.event('sign_up', { userid: (<IRSS3>this.rss3).account.address });
                    await this.$router.push('/setup');
                } else {
                    // Login
                    this.$gtag.event('login', { userid: (<IRSS3>this.rss3).account.address });
                    const redirectFrom = sessionStorage.getItem('redirectFrom');
                    sessionStorage.removeItem('redirectFrom');
                    await this.$router.push(redirectFrom || '/home');
                }
            }
        }
    }

    async back() {
        this.$gtag.event('cancelSetupRNS', { userid: (<IRSS3>this.rss3).account.address });
        await RSS3.getAssetProfile((<IRSS3>this.rss3).account.address, true);
        window.history.back();
    }

    async verifyRNS() {
        this.rns = this.rns.toLowerCase();
        if (this.rns.length < 3 || this.rns.length >= 15) {
            this.notice = 'An RNS must have at least 3 characters and no more than 15';
            return;
        }
        this.isLoading = true;
        // Check $PASS balance
        const passBalance = await RNSUtils.balanceOfPass3((<IRSS3>this.rss3).account.address);
        console.log('Your $PASS: ', passBalance);
        if (passBalance < 1) {
            this.notice = 'Sorry, but you need 1 $PASS to register an RNS';
            this.isLoading = false;
        } else if (parseInt((await RNSUtils.name2Addr(`${this.rns}.pass3.me`)).toString()) !== 0) {
            // Already taken
            this.notice = 'Sorry, but this RNS has already been taken.';
            this.isLoading = false;
        } else {
            this.isShowingConfirm = true;
            this.isLoading = false;
            this.notice = '';
        }
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
                @apply text-8xl text-primary font-bold;
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
                        @apply text-primary;
                    }
                }
            }
        }
    }
}
</style>
