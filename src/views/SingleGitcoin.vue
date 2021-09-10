<template>
    <div class="h-screen bg-gitcoin-bg overflow-y-auto">
        <div class="main px-4 py-8 max-w-md m-auto">
            <div class="header flex justify-between items-center pb-4">
                <Button size="sm" class="w-10 h-10 bg-white text-primary shadow-secondary" @click="back">
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
                <ImgHolder
                    class="w-10 h-10 inline-flex my-auto cursor-pointer"
                    :is-rounded="true"
                    :is-border="false"
                    :src="this.rss3Profile.avatar"
                    alt="nya"
                />
            </div>
            <GitcoinItem :imageUrl="this.grant.logo" :size="Width > 416 ? 416 : Width"></GitcoinItem>
            <div
                class="
                    w-full
                    px-5
                    py-4
                    bg-white
                    shadow-gitcoin-sm
                    rounded
                    flex flex-col
                    justify-start
                    items-start
                    gap-4
                    text-black
                    mt-4
                "
            >
                <div class="w-full">
                    <h2 class="text-xl font-semibold truncate">
                        {{ this.grant.slug }}
                    </h2>
                    <div
                        class="text-sm leading-normal text-gitcoin-title truncate cursor-pointer"
                        @click="toExternalLink(this.grant.reference_url)"
                    >
                        {{ this.grant.reference_url }}
                    </div>
                </div>
                <div>
                    <h2 class="text-xl font-semibold">Contributions</h2>
                    <h1 class="text-2xl font-semibold text-gitcoin-title">{{ this.donationInfo.length }}</h1>
                </div>
                <div class="w-full flex flex-col gap-y-2">
                    <div class="flex flex-row justify-start gap-x-2" v-for="(item, index) in donationInfo" :key="index">
                        <div
                            class="
                                flex-1
                                bg-gitcoin-bg
                                text-black
                                rounded rounded-xl
                                flex flex-row
                                justify-between
                                items-center
                                px-4
                                py-2
                            "
                        >
                            <div class="text-gitcoin-title">{{ item.formatedAmount + ' ' + item.symbol }}</div>
                            <div>{{ timeDifferent(item.timeStamp) }}</div>
                        </div>
                        <Button
                            size="sm"
                            class="w-9 h-9 ml-1 bg-gitcoin-button text-white shadow-gitcoin-sm"
                            @click="toEtherscan(item.txHash)"
                        >
                            <i class="bx bx-link-external bx-xs" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import ImgHolder from '@/components/ImgHolder.vue';
import GitcoinItem from '@/components/GitcoinItem.vue';
import config from '@/config';
import RNSUtils from '@/common/rns';
import RSS3 from '@/common/rss3';
import axios from 'axios';

interface Profile {
    avatar: string;
    username: string;
    address: string;
    bio: string;
}

export interface GrantInfo {
    active: boolean;
    title?: string;
    slug?: string;
    description?: string;
    reference_url?: string;
    logo?: string;
    admin_address?: string;
    amount_received?: string;
    token_address?: string;
    token_symbol?: string;
    contract_address?: string;
}

export interface DonationInfo {
    donor: string;
    tokenAddr: string;
    amount: string;
    symbol?: string;
    formatedAmount?: string;
    timeStamp: string;
    txHash: string;
}

@Options({
    components: { ImgHolder, Button, GitcoinItem },
})
export default class SingleGitcoin extends Vue {
    public Width: number = window.innerWidth - 32;
    public rns: string = '';
    public ethAddress: string = '';
    public rss3Profile: Profile = {
        avatar: config.defaultAvatar,
        username: '',
        address: '',
        bio: '',
    };

    public grant?: GrantInfo = {
        active: true,
        logo: config.defaultAvatar,
        slug: '...',
        reference_url: '...',
    };
    public donationInfo?: DonationInfo[] = [];

    async mounted() {
        const address = <string>this.$route.params.address;
        if (!address.startsWith('0x')) {
            this.rns = address;
            this.ethAddress = (await RNSUtils.name2Addr(`${address}.pass3.me`)).toString();
        } else {
            this.ethAddress = address;
            this.rns = (await RNSUtils.addr2Name(address)).toString();
        }
        const rss3 = await RSS3.visitor();

        const profile = await rss3.profile.get(this.ethAddress);
        this.rss3Profile.avatar = profile?.avatar?.[0] || config.defaultAvatar;
        this.rss3Profile.username = profile?.name?.[0] || '';
        this.rss3Profile.address = this.ethAddress;

        await this.loadGitcoin();
    }

    public async loadGitcoin() {
        const platform: string = <string>this.$route.params.platform;
        const id: string = <string>this.$route.params.id;
        const identity: string = <string>this.$route.params.identity;

        const res = await axios({
            method: 'get',
            url: `http://localhost:3000/asset-profile/${this.ethAddress}/gitcoin-donation/`,
            params: {
                platform: platform,
                id: id,
                identity: identity,
            },
        });

        this.grant = res.data.data.grant;
        this.donationInfo = res.data.data.txs;
    }

    public timeDifferent(timeStamp: number) {
        const date1: any = new Date(timeStamp * 1000);
        const date2: any = Date.now();
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.ceil((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (diffDays == 0) {
            return diffHours + ' hours ago';
        } else if (diffHours == 0) {
            return diffDays + ' days ago';
        } else {
            return diffDays + ' days ' + diffHours + ' hours ago';
        }
    }

    public toExternalLink(address: string) {
        window.open(address);
    }

    public toEtherscan(txHash: string) {
        window.open(`https://etherscan.io/tx/${txHash}`);
    }

    public back() {
        window.history.back();
    }
}
</script>

<style></style>
