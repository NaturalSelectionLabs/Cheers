<template>
    <div
        class="
            flex flex-col
            gap-4
            items-start
            justify-start
            px-5
            w-full
            text-black text-body-text
            border-card
            rounded
            filter
        "
    >
        <div class="w-full">
            <h2 class="break-words text-xl font-semibold">
                {{ details.title || 'Inactive Project' }}
            </h2>
            <div
                class="text-gitcoin-title text-sm leading-normal cursor-pointer truncate"
                @click="toExternalLink(details.reference_url)"
            >
                <i class="bx bx-link align-middle" />
                {{ details.reference_url }}
            </div>
        </div>
        <div class="w-full">
            <h2 class="break-words text-xl font-semibold">Description</h2>
            <div class="line-clamp-3 break-words text-sm leading-normal">
                {{ details.description || 'No information provided by Gitcoin.' }}
            </div>
        </div>
        <div>
            <h2 class="text-xl font-semibold">Contributions</h2>
            <h1 class="text-gitcoin-title text-2xl font-semibold">
                <vue3-autocounter
                    ref="counter"
                    :startAmount="0"
                    :endAmount="parseInt(donationInfo.length)"
                    :duration="1"
                    separator=","
                    :autoinit="true"
                />
            </h1>
        </div>
        <div class="flex flex-col gap-y-2 w-full">
            <div class="flex flex-row gap-x-2 justify-start" v-for="item in donationInfo" :key="item.txHash">
                <div
                    class="flex flex-1 flex-row items-center justify-between px-4 py-2 text-black bg-body-bg rounded-xl"
                >
                    <div class="flex-shrink pr-2 text-gitcoin-title">
                        <vue3-autocounter
                            ref="counter"
                            :startAmount="0"
                            :endAmount="parseFloat(item.formatedAmount)"
                            :duration="1"
                            separator=","
                            :decimals="item.formatedAmount.split('.')[1].length"
                            :suffix="item.symbol"
                            :autoinit="true"
                        />
                    </div>
                    <div class="flex-1 w-0 text-right text-gitcoin-title truncate">
                        {{ timeDifferent(item.timeStamp) }}
                    </div>
                </div>
                <Button
                    size="sm"
                    class="ml-1 w-9 h-9 text-gitcoin-btn-m-text bg-gitcoin-btn-m shadow-gitcoin-btn-m"
                    @click="toScanTx(item)"
                >
                    <i class="bx bx-link-external bx-xs" />
                </Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { DonationInfo, GrantInfo } from '@/common/types';
import Vue3Autocounter from 'vue3-autocounter';
import Button from '@/components/Button/Button.vue';

@Options({
    components: { Button, Vue3Autocounter },
    props: {
        details: Object,
        donationInfo: Array,
    },
})
export default class GitcoinDetails extends Vue {
    details!: GrantInfo;
    donationInfo!: DonationInfo[];

    timeDifferent(timeStamp: number) {
        const date1: any = new Date(timeStamp * 1000);
        const date2: any = Date.now();
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.ceil((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (diffDays == 0) {
            return diffHours + ' hours ago';
        } else if (diffHours == 0) {
            return diffDays + ' days ago';
        } else {
            return diffDays + ' days ' + diffHours + ' hours ago';
        }
    }

    toScanTx(item: DonationInfo) {
        if (item.approach === 'zkSync') {
            window.open(`https://zkscan.io/explorer/transactions/${item.txHash}`);
        } else {
            window.open(`https://etherscan.io/tx/${item.txHash}`);
        }
    }

    toExternalLink(address: string) {
        window.open(address);
    }
}
</script>
