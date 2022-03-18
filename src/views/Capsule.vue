<template>
    <div class="h-full w-full bg-paper px-36 py-36">
        <div class="flex flex-col items-start gap-20">
            <h1 class="font-cormorant text-6xl">Capsule</h1>
            <!-- On Entering -->
            <div v-if="!isPrepared" class="flex flex-col items-start gap-20">
                <p class="font-cormorant text-2xl">
                    Yet, do thy worst old Time: despite thy wrong, <br />
                    My love shall in my verse ever live young.
                </p>
                <Button
                    size="lg"
                    class="h-14 w-90 rounded-xs bg-black font-cormorant text-2xl font-medium text-white"
                    @click="createWallet"
                >
                    <span class="w-80 text-left">Start</span>
                </Button>
            </div>

            <!-- On Creating -->
            <div v-else-if="!isCreated" class="flex flex-col items-start gap-10">
                <p class="font-cormorant text-2xl">
                    Your capsule will be created with:
                    <span
                        class="cursor-pointer underline"
                        @click="openUrl(`https://etherscan.io/address/${walletAddress}`)"
                        >{{ walletAddress }}</span
                    >
                </p>
                <div class="flex w-full flex-row items-start gap-4 font-cormorant font-medium">
                    <div class="w-32 pt-3">Send to</div>
                    <Input
                        class="w-full font-notoSerif"
                        :is-single-line="true"
                        placeholder="Recepient's Address"
                        v-model="recipient"
                    />
                </div>
                <div class="flex w-full flex-row items-start gap-4 font-cormorant font-medium">
                    <div class="w-32 pt-3">Open at</div>
                    <div class="w-full">
                        <input
                            class="input cursor-pointer rounded-xl border-input border-input-border bg-card-bg pb-3 pl-5 pr-5 pt-3 font-notoSerif placeholder-black placeholder-opacity-20 outline-none"
                            type="datetime-local"
                            v-model="openTsp"
                            :min="minTsp"
                        />
                    </div>
                </div>
                <div class="flex w-full flex-row items-start gap-4 font-cormorant font-medium">
                    <div class="w-32 pt-3">Words inside</div>
                    <Input
                        class="w-full font-notoSerif"
                        :is-single-line="false"
                        placeholder="Leave your message ..."
                        v-model="message"
                    />
                </div>
                <Button
                    size="lg"
                    class="h-14 w-90 rounded-xs bg-black font-cormorant text-2xl font-medium text-white"
                    :class="{ disabled: isSubmitted }"
                    @click="createCapsule"
                >
                    <span class="w-80 text-left">{{ isSubmitted ? 'Creating...' : 'Create' }}</span>
                </Button>
            </div>

            <!-- On Completing -->
            <div v-else class="flex flex-col items-start gap-20">
                <p class="font-cormorant text-2xl">Congrats! You can check your capsule’s status now.</p>
                <Button
                    size="lg"
                    class="h-14 w-90 rounded-xs bg-black font-cormorant text-2xl font-medium text-white"
                    @click="openUrl(`https://bscscan.com/tx/${txn}`)"
                >
                    <span class="w-80 text-left">Check</span>
                </Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue, setup } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import Input from '@/components/Input/Input.vue';
import { useReCaptcha } from 'vue-recaptcha-v3';
import axios from 'axios';
import { ethers, Wallet } from 'ethers';

@Options({
    name: 'Capsule',
    components: {
        Button,
        Input,
    },
})
export default class Capsule extends Vue {
    wallet: Wallet | undefined;
    walletAddress: string = '';
    isPrepared: boolean = false;
    isCreated: boolean = false;
    recipient: string = '';
    openTsp: string = '';
    message: string = '';
    minTsp: string = '';
    notice: string = '';
    txn: string = '';
    isSubmitted: boolean = false;

    verifyWithCaptcha = setup(() => {
        const reCaptcha = useReCaptcha();
        const exec = async () => {
            await reCaptcha?.recaptchaLoaded();
            return await reCaptcha?.executeRecaptcha('createWallet');
        };
        return {
            exec,
        };
    });

    async mounted() {
        const currentTsp = Date.now();
        this.minTsp = new Date(currentTsp + 31556952000).toISOString().slice(0, 16);
        console.log(this.minTsp);
    }

    async createWallet() {
        this.wallet = ethers.Wallet.createRandom();
        this.walletAddress = this.wallet.address;
        this.isPrepared = true;
    }

    async createCapsule() {
        this.isSubmitted = true;
        const captchaToken = await this.verifyWithCaptcha.exec();
        // console.log(captchaToken);

        const tsp = Math.ceil(new Date(this.openTsp).valueOf() / 1000);
        const res = await axios.post(`https://capsule.cheer.bio/mint/`, {
            minter: this.walletAddress,
            receiver: this.recipient,
            words: this.message,
            tsp,
            reCaptcha: captchaToken,
        });
        // console.log(res.data);
        if (res.data.error) {
            //TODO
            console.log(res.data.error);
            return;
        }

        let abi = ['function mint(address receiver, bytes32 mHash, uint tsp, uint expiry, bytes memory sig)'];
        // let contractAddress = ''; // bsc testnet
        let contractAddress = '0x999017cb5652caf5f324a8e44f813903ba3c46eb'; // bsc mainnet
        // let url = 'https://data-seed-prebsc-1-s1.binance.org:8545'; // bsc testnet
        let url = 'https://bsc-dataseed.binance.org'; // bsc mainnet

        let provider = new ethers.providers.JsonRpcProvider(url);
        let contract = new ethers.Contract(contractAddress, abi, this.wallet);

        if (this.wallet) {
            try {
                const contractSigned = contract.connect(provider);
                const txData = await contractSigned.populateTransaction.mint(
                    this.recipient,
                    res.data.msgHash,
                    tsp,
                    res.data.expiry,
                    res.data.sig,
                );
                // console.log('tx', txData);
                const tx = await this.wallet.signTransaction({
                    ...txData,
                    gasLimit: 180000,
                    gasPrice: 5000000000,
                });
                const r = await provider.sendTransaction(tx);

                // console.log(r.hash);
                this.isCreated = true;
                this.txn = r.hash;
            } catch (e) {
                console.log(e);
            }
        }
    }

    openUrl(url: string) {
        window.open(url);
    }
}
</script>

<style scoped lang="postcss">
.input::placeholder {
    font-weight: 500;
}

.disabled {
    cursor: not-allowed;
    pointer-events: none;

    opacity: 0.5;
}
</style>
