<template>
    <div class="h-screen bg-account-bg overflow-y-auto">
        <div class="m-auto pb-32 pt-8 px-4 max-w-screen-lg">
            <Header :ethAddress="ethAddress" :rns="rns" :rss3Profile="rss3Profile" title="Accounts" theme="account" />
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
import Button from '@/components/Button/Button.vue';
import EVMpAccountItem from '@/components/Account/EVMpAccountItem.vue';
import AccountItem from '@/components/Account/AccountItem.vue';
import RSS3 from '@/common/rss3';
import { RSS3Account, RSS3Profile } from 'rss3-next/types/rss3';
import ContentProviders from '@/common/content-providers';
import utils from '@/common/utils';
import Header from '@/components/Common/Header.vue';
import setupTheme from '@/common/theme';

@Options({
    name: 'Accounts',
    components: { EVMpAccountItem, Button, AccountItem, Header },
})
export default class Accounts extends Vue {
    rns: string = '';
    ethAddress: string = '';
    isOwner: boolean = false;
    accounts: RSS3Account[] = [];
    lastRoute: string = '';
    rss3Profile: RSS3Profile = {};

    async mounted() {
        await this.initLoad();
    }

    async initLoad() {
        this.lastRoute = this.$route.fullPath;
        await RSS3.reconnect();
        const rss3 = await RSS3.visitor();
        const owner: string = <string>rss3.account.address;

        const { ethAddress, rns } = await utils.getAddress(<string>this.$route.params.address);
        this.ethAddress = ethAddress;
        this.rns = rns;
        this.isOwner = ethAddress == owner;

        this.rss3Profile = await rss3.profile.get(this.ethAddress);

        // Setup theme
        setupTheme(await rss3.assets.get(this.ethAddress));

        const allAccounts = await rss3.accounts.get(this.ethAddress);
        const { listed } = await utils.initAccounts(allAccounts);
        this.accounts = listed;
        this.accounts.unshift({
            platform: 'EVM+',
            identity: this.ethAddress,
            signature: '',
            tags: ['pass:order:-1'],
        });
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
    filter(address: string) {
        return address.length > 14 ? `${address.slice(0, 6)}....${address.slice(-4)}` : address;
    }

    copyToClipboard(address: string) {
        navigator.clipboard.writeText(address).then(
            function () {
                console.log('Async: Copying to clipboard was successful!');
            },
            function (err) {
                console.log('Async: Could not copy the account: ', err);
            },
        );
    }

    toExternalLink(address: string, platform: string) {
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

    toSetupAccounts() {
        this.$router.push(`/setup/accounts`);
    }

    activated() {
        if (this.lastRoute !== this.$route.fullPath) {
            this.initLoad();
        }
    }
}
</script>

<style></style>