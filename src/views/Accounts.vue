<template>
    <div class="h-screen bg-account-bg overflow-y-auto">
        <div class="m-auto pb-32 pt-8 px-4 max-w-screen-lg">
            <div class="header flex items-center justify-between pb-4">
                <Button
                    size="sm"
                    class="w-10 h-10 text-secondary-btn-text bg-secondary-btn shadow-secondary-btn"
                    @click="back"
                >
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
                <div class="section-title text-center text-account-title text-2xl font-bold">Accounts</div>
                <ImgHolder
                    class="inline-flex my-auto w-10 h-10 cursor-pointer"
                    :is-rounded="true"
                    :is-border="false"
                    :src="rss3Profile.avatar"
                    :alt="rss3Profile.username"
                    @click="toPublicPage(rns, ethAddress)"
                />
            </div>
            <div class="m-auto max-w-md">
                <div class="flex flex-col gap-y-4">
                    <div
                        class="account-wrapper grid grid-cols-6 items-center justify-items-center"
                        v-for="item in accounts"
                        :key="item.platform + item.identity"
                    >
                        <EVMpAccountItem v-if="item.platform === 'EVM+'" :size="70" :address="item.identity" />
                        <AccountItem v-else :size="70" :chain="item.platform" :address="item.identity" />
                        <span class="address col-span-3 text-account-title text-2xl font-semibold">{{
                            getDisplayAddress(item)
                        }}</span>
                        <Button
                            size="sm"
                            class="w-10 h-10 text-account-btn-m-text bg-account-btn-m shadow-account-btn-m"
                            @click="copyToClipboard(item.identity)"
                        >
                            <i class="bx bxs-copy bx-sm"></i>
                        </Button>
                        <Button
                            size="sm"
                            class="w-10 h-10 text-account-btn-m-text bg-account-btn-m shadow-account-btn-m"
                            @click="toExternalLink(item.identity, item.platform)"
                        >
                            <i class="bx bx-link-external bx-sm"></i>
                        </Button>
                    </div>
                </div>
            </div>
            <div
                class="fixed bottom-2 left-0 right-0 flex gap-5 m-auto px-4 py-4 w-full max-w-md bg-btn-container"
                v-if="isOwner"
            >
                <Button
                    size="lg"
                    class="m-auto text-account-btn-m-text text-lg bg-account-btn-m shadow-account-btn-m"
                    @click="toSetupAccounts"
                >
                    <span>Manage Accounts</span>
                </Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import ImgHolder from '@/components/ImgHolder.vue';
import EVMpAccountItem from '@/components/EVMpAccountItem.vue';
import AccountItem from '@/components/AccountItem.vue';
import RSS3, { IRSS3 } from '@/common/rss3';
import { RSS3Account, RSS3Index } from 'rss3-next/types/rss3';
import RNSUtils from '@/common/rns';
import config from '@/config';
import ContentProviders from '@/common/content-providers';

interface Profile {
    avatar: string;
    username: string;
    address: string;
    bio: string;
}

@Options({
    name: 'Accounts',
    components: { EVMpAccountItem, ImgHolder, Button, AccountItem },
})
export default class Accounts extends Vue {
    rns: string = '';
    ethAddress: string = '';
    public isOwner: boolean = false;
    public accounts: RSS3Account[] = [];
    public rss3Profile: Profile = {
        avatar: config.defaultAvatar,
        username: '',
        address: '',
        bio: '',
    };
    lastRoute: string = '';

    async mounted() {
        await this.initLoad();
    }

    async initLoad() {
        this.lastRoute = this.$route.fullPath;
        this.accounts = [];
        this.rss3Profile.avatar = config.defaultAvatar;

        await RSS3.reconnect();
        const rss3 = await RSS3.visitor();
        const owner: string = <string>rss3.account.address;
        await this.getAddress(owner);

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

        this.accounts.push({
            platform: 'Ethereum',
            identity: this.ethAddress,
            signature: '',
            tags: ['pass:order:-1'],
        });

        const accounts = await rss3.accounts.get(this.ethAddress);
        await this.loadAccounts(accounts);
    }

    async getAddress(owner: string) {
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

            this.isOwner = this.ethAddress === owner;
        }

        return true;
    }

    getDisplayAddress(account: RSS3Account) {
        if (account.platform === 'Misskey' && account.identity.length <= 14) {
            return account.identity;
        } else {
            return this.filter(account.identity);
        }
    }
    /**
     * filter
     */
    public filter(address: string) {
        return address.length > 14 ? `${address.slice(0, 6)}....${address.slice(-4)}` : address;
    }

    public copyToClipboard(address: string) {
        navigator.clipboard.writeText(address).then(
            function () {
                console.log('Async: Copying to clipboard was successful!');
            },
            function (err) {
                console.log('Async: Could not copy the account: ', err);
            },
        );
    }

    async loadAccounts(accounts: RSS3Account[]) {
        // Get accounts
        if (accounts) {
            accounts.forEach((account: RSS3Account) => {
                if (!account.tags?.includes('hidden')) {
                    this.accounts.push(account);
                }
            });
            this.accounts.sort((a, b) => {
                return this.getTaggedOrder(a) - this.getTaggedOrder(b);
            });
        }
    }

    getTaggedOrder(taggedElement: RSS3Account): number {
        if (!taggedElement.tags) {
            return -1;
        }
        const orderPattern = /^pass:order:(-?\d+)$/i;
        for (const tag of taggedElement.tags) {
            if (orderPattern.test(tag)) {
                return parseInt(orderPattern.exec(tag)?.[1] || '-1');
            }
        }
        return -1;
    }

    toPublicPage(rns: string, ethAddress: string) {
        if (rns && config.subDomain.isSubDomainMode) {
            this.$router.push('/');
        } else {
            this.$router.push(`/${rns || ethAddress}`);
        }
    }

    public toExternalLink(address: string, platform: string) {
        switch (platform) {
            case 'BSC':
                window.open(`https://bscscan.com/address/${address}`);
                break;
            case 'Ethereum':
                window.open(`https://etherscan.io/address/${address}`);
                break;
            case 'Misskey':
            case 'Twitter':
                window.open(ContentProviders[platform].getAccountLink(address));
                break;
        }
    }

    public toSetupAccounts() {
        this.$router.push(`/setup/accounts`);
    }

    public back() {
        if (window.history.state.back) {
            window.history.back();
        } else {
            this.$router.push(config.subDomain.isSubDomainMode ? '/' : `/${this.rns || this.ethAddress}`);
        }
    }

    activated() {
        if (this.lastRoute !== this.$route.fullPath) {
            this.initLoad();
        }
    }
}
</script>

<style></style>
