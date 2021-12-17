<template>
    <div class="h-screen bg-account-bg overflow-y-auto">
        <div class="m-auto pb-32 pt-8 px-4 max-w-screen-lg">
            <Header :ethAddress="ethAddress" :rns="rns" :rss3Profile="rss3Profile" title="Accounts" theme="account" />
            <div class="m-auto max-w-md">
                <div class="flex flex-col gap-y-4">
                    <div
                        class="grid grid-cols-6 items-center justify-items-center"
                        v-for="item in accounts"
                        :key="item.platform + item.identity"
                    >
                        <EVMpAccountItem v-if="item.platform === 'EVM+'" :size="70" :address="item.identity" />
                        <AccountItem v-else :size="70" :chain="item.platform" :address="item.identity" />
                        <span class="col-span-3 text-account-title text-xl font-semibold sm:text-2xl">{{
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
import { utils as RSS3Utils } from 'rss3';
import ContentProviders from '@/common/content-providers';
import utils from '@/common/utils';
import Header from '@/components/Common/Header.vue';
import setupTheme from '@/common/theme';
import { DetailedAccount } from '@/common/types';

@Options({
    name: 'Accounts',
    components: { EVMpAccountItem, Button, AccountItem, Header },
})
export default class Accounts extends Vue {
    rns: string = '';
    ethAddress: string = '';
    isOwner: boolean = false;
    accounts: DetailedAccount[] = [];
    lastRoute: string = '';
    rss3Profile: RSS3Profile = {};

    async mounted() {
        await this.initLoad();
    }

    async initLoad() {
        const addrOrName = utils.getAddress(<string>this.$route.params.address);
        const pageOwner = await RSS3.setPageOwner(addrOrName);
        this.ethAddress = pageOwner.address;
        this.rns = pageOwner.name;
        this.isOwner = RSS3.isNowOwner();

        if (pageOwner.profile) {
            this.rss3Profile = pageOwner.profile;
        }

        const { listed } = await utils.initAccounts();
        const accountDetails = listed.map((account) => RSS3Utils.id.parseAccount(account.id));
        this.accounts = [
            {
                platform: 'EVM+',
                identity: RSS3.getLoginUser().address,
            },
        ].concat(accountDetails);
    }

    getDisplayAddress(account: DetailedAccount) {
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
            case 'EVM+':
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
