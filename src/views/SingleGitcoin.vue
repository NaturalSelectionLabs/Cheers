<template>
    <div class="h-screen bg-gitcoin-bg overflow-y-auto">
        <div class="px-4 pt-8 pb-20 max-w-md m-auto">
            <div class="header flex justify-between items-center pb-4">
                <Button
                    size="sm"
                    class="w-10 h-10 bg-secondary-btn text-secondary-btn-text shadow-secondary-btn"
                    @click="back"
                >
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
                <ImgHolder
                    class="w-10 h-10 inline-flex my-auto cursor-pointer"
                    :is-rounded="true"
                    :is-border="false"
                    :src="rss3Profile.avatar"
                    :alt="rss3Profile.username"
                    @click="toPublicPage(rns, ethAddress)"
                />
            </div>
            <GitcoinItem :imageUrl="grant.logo || defaultAvatar" :size="Width > 416 ? 416 : Width"></GitcoinItem>
            <div
                class="
                    w-full
                    px-5
                    py-4
                    bg-body-bg
                    rounded
                    filter
                    shadow-gitcoin
                    border-card
                    text-body-text
                    flex flex-col
                    justify-start
                    items-start
                    gap-4
                    text-black
                    mt-4
                "
            >
                <div class="w-full">
                    <h2 class="text-xl font-semibold break-words">
                        {{ grant.title || 'Inactive Project' }}
                    </h2>
                    <div
                        class="text-sm leading-normal text-gitcoin-title truncate cursor-pointer"
                        @click="toExternalLink(grant.reference_url)"
                    >
                        {{ grant.reference_url }}
                    </div>
                </div>
                <div class="w-full">
                    <h2 class="text-xl font-semibold break-words">Description</h2>
                    <div class="text-sm leading-normal break-words line-clamp-3">
                        {{ grant.description || 'No information provided by Gitcoin.' }}
                    </div>
                </div>
                <div>
                    <h2 class="text-xl font-semibold">Contributions</h2>
                    <h1 class="text-2xl font-semibold text-gitcoin-title">
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
                <div class="w-full flex flex-col gap-y-2">
                    <div class="flex flex-row justify-start gap-x-2" v-for="item in donationInfo" :key="item.txHash">
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
                            <div class="text-gitcoin-title flex-shrink pr-2">
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
                            <div class="flex-1 truncate w-0 text-right text-gitcoin-title">
                                {{ timeDifferent(item.timeStamp) }}
                            </div>
                        </div>
                        <Button
                            size="sm"
                            class="w-9 h-9 ml-1 bg-gitcoin-btn-m text-gitcoin-btn-m-text shadow-gitcoin-btn-m"
                            @click="toScanTx(item)"
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
import RSS3, { IRSS3 } from '@/common/rss3';
import Vue3Autocounter from 'vue3-autocounter';
import { RSS3Index } from 'rss3-next/types/rss3';

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

type DonationApproach = 'zkSync' | 'Standard';
export interface DonationInfo {
    donor: string;
    tokenAddr?: string;
    tokenId?: number;
    amount: string;
    symbol?: string;
    formatedAmount?: string;
    timeStamp: string;
    txHash: string;
    approach?: DonationApproach;
}

@Options({
    name: 'SingleGitcoin',
    components: { ImgHolder, Button, GitcoinItem, Vue3Autocounter },
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
    private defaultAvatar = config.defaultAvatar;

    public grant?: GrantInfo = {
        active: true,
        logo: config.defaultAvatar,
        slug: '...',
        reference_url: '...',
        description: '...',
    };
    public donationInfo?: DonationInfo[] = [];

    async mounted() {
        await RSS3.reconnect();
        const rss3 = await RSS3.visitor();
        await this.getAddress();

        const profile = await rss3.profile.get(this.ethAddress);
        this.rss3Profile.avatar = profile?.avatar?.[0] || config.defaultAvatar;
        this.rss3Profile.username = profile?.name?.[0] || '';
        this.rss3Profile.address = this.ethAddress;

        // Setup theme
        const themes = RSS3.getAvailableThemes(await rss3.assets.get(this.ethAddress));
        if (themes[0]) {
            document.body.classList.add(themes[0].class);
        } else {
            document.body.classList.remove(...document.body.classList);
        }

        await this.loadGitcoin();
    }

    async getAddress() {
        let address: string = '';
        if (config.subDomain.isSubDomainMode) {
            // Is subdomain mode
            address = window.location.host.split('.')[0];
        } else if (this.$route.params.address) {
            address = <string>this.$route.params.address;
        } else {
            return false;
        }

        if (address) {
            if (address.startsWith('0x')) {
                // Might be address type
                // Get RNS and redirect
                this.ethAddress = address;
                this.rns = (await RNSUtils.addr2Name(address)).replace(config.rns.suffix, '');
                if (this.rns !== '') {
                    if (config.subDomain.isSubDomainMode) {
                        window.location.host = this.rns + '.' + config.subDomain.rootDomain;
                    } else {
                        await this.$router.push(`/${this.rns}`);
                    }
                }
            } else {
                // RNS
                this.rns = address;
                this.ethAddress = (await RNSUtils.name2Addr(address + config.rns.suffix)).toString();
                if (parseInt(this.ethAddress) === 0) {
                    return false;
                }
            }
        }

        return true;
    }

    public async loadGitcoin() {
        const platform: string = <string>this.$route.params.platform;
        const identity: string = <string>this.$route.params.identity;
        const id: string = <string>this.$route.params.id;

        const res = await RSS3.getGitcoinDonation(this.ethAddress, platform, identity, id);
        if (res) {
            this.grant = res.data.grant;
            this.donationInfo = res.data.txs.sort((a, b) => {
                return parseInt(b.timeStamp) - parseInt(a.timeStamp);
            });
        }
    }

    public timeDifferent(timeStamp: number) {
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

    public toExternalLink(address: string) {
        window.open(address);
    }

    toScanTx(item: DonationInfo) {
        if (item.approach === 'zkSync') {
            window.open(`https://zkscan.io/explorer/transactions/${item.txHash}`);
        } else {
            window.open(`https://etherscan.io/tx/${item.txHash}`);
        }
    }

    toPublicPage(rns: string, ethAddress: string) {
        if (rns && config.subDomain.isSubDomainMode) {
            this.$router.push('/');
        } else {
            this.$router.push(`/${rns || ethAddress}`);
        }
    }

    back() {
        if (window.history.length > 2) {
            window.history.back();
        } else {
            this.$router.push(
                (config.subDomain.isSubDomainMode ? '' : `/${this.rns || this.ethAddress}`) +
                    `/${this.rns || this.ethAddress}/gitcoins`,
            );
        }
    }
}
</script>

<style></style>
