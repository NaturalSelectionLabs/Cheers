<template>
    <div class="fixed h-full w-full overflow-hidden bg-paper px-36 py-36">
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
                    @click="createCapsule"
                >
                    <span class="w-80 text-left">Create</span>
                </Button>
            </div>

            <!-- On Completing -->
            <div v-else class="flex flex-col items-start gap-20">
                <p class="font-cormorant text-2xl">Congrats! You can check your capsule’s status now.</p>
                <Button
                    size="lg"
                    class="h-14 w-90 rounded-xs bg-black font-cormorant text-2xl font-medium text-white"
                    @click="openUrl(`https://etherscan.io/tx/${txn}`)"
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
        const captchaToken = await this.verifyWithCaptcha.exec();
        console.log(captchaToken);

        const res = await axios.post(`https://capsule.cheer.bio/mint/`, {
            minter: this.walletAddress,
            receiver: this.recipient,
            words: this.message,
            tsp: new Date(this.openTsp).valueOf(),
            reCaptcha: captchaToken,
        });
        console.log(res.data);

        let abi = [
            'event ValueChanged(address indexed author, string oldValue, string newValue)',
            'constructor(string value)',
            'function getValue() view returns (string value)',
            'function setValue(string value)',
        ];
        let contractAddress = '';
        let url = '';
        let provider = new ethers.providers.JsonRpcProvider(url);
        let contract = new ethers.Contract(contractAddress, abi, provider);
        if (this.wallet) {
            let contractSigned = contract.connect(this.wallet);
            let tx = await contractSigned.setValue();
            await tx.wait();
            this.isCreated = true;
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
</style>
