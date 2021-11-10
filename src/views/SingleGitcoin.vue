<template>
    <div class="h-screen bg-gitcoin-bg overflow-y-auto">
        <div class="m-auto pb-20 pt-8 px-4 max-w-screen-lg">
            <div class="header flex items-center justify-between pb-4">
                <Button
                    size="sm"
                    class="w-10 h-10 text-secondary-btn-text bg-secondary-btn shadow-secondary-btn"
                    @click="back"
                >
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
                <ImgHolder
                    class="inline-flex my-auto w-10 h-10 cursor-pointer"
                    :is-rounded="true"
                    :is-border="false"
                    :src="rss3Profile.avatar"
                    :alt="rss3Profile.username"
                    @click="toPublicPage(rns, ethAddress)"
                />
            </div>
            <section class="m-auto max-w-screen-sm">
                <GitcoinItem class="mb-4" :imageUrl="grant.logo || defaultAvatar" :size="Width"></GitcoinItem>
                <div
                    class="
                        flex flex-col
                        gap-4
                        items-start
                        justify-start
                        mt-4
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
                            {{ grant.title || 'Inactive Project' }}
                        </h2>
                        <div
                            class="text-gitcoin-title text-sm leading-normal cursor-pointer truncate"
                            @click="toExternalLink(grant.reference_url)"
                        >
                            <i class="bx bx-link align-middle" />
                            {{ grant.reference_url }}
                        </div>
                    </div>
                    <div class="w-full">
                        <h2 class="break-words text-xl font-semibold">Description</h2>
                        <div class="line-clamp-3 break-words text-sm leading-normal">
                            {{ grant.description || 'No information provided by Gitcoin.' }}
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
                        <div
                            class="flex flex-row gap-x-2 justify-start"
                            v-for="item in donationInfo"
                            :key="item.txHash"
                        >
                            <div
                                class="
                                    flex flex-1 flex-row
                                    items-center
                                    justify-between
                                    px-4
                                    py-2
                                    text-black
                                    bg-body-bg
                                    rounded-xl
                                "
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
            </section>
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
import Vue3Autocounter from 'vue3-autocounter';
import { getName } from '@/common/utils';

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
    public Width: number = Math.min(window.innerWidth - 32, 640);
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
        this.rss3Profile.username = profile?.name || '';
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
            address = getName();
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
                this.rns = await RNSUtils.addr2Name(address);
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
                this.ethAddress = (await RNSUtils.name2Addr(address)).toString();
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
        if (window.history.state.back) {
            window.history.back();
        } else {
            this.$router.push(
                (config.subDomain.isSubDomainMode ? '' : `/${this.rns || this.ethAddress}`) + `/gitcoins`,
            );
        }
    }
}
</script>

<style></style>
