<template>
    <div class="h-screen overflow-y-auto">
        <div class="m-auto pb-32 pt-8 px-4 max-w-screen-lg">
            <Header />
            <TransBarCard
                :title="rss3Profile.name ? rss3Profile.name + `'s Accounts` : 'Accounts'"
                :haveDetails="true"
                :haveContent="false"
                :haveContentInfo="false"
            >
                <template #header>
                    <i v-if="isOwner" class="bx bxs-pencil bx-xs cursor-pointer" @click="toSetupAccounts" />
                </template>
                <template #details>
                    <div
                        class="
                            grid
                            gap-4
                            grid-cols-1
                            items-center
                            justify-between
                            py-4
                            w-full
                            md:grid-cols-2 md:justify-start
                        "
                    >
                        <div
                            class="flex flex-row gap-4 items-center justify-between w-full cursor-pointer md:max-w-xs"
                            v-for="item in accounts"
                            :key="item.platform + item.identity"
                            @click="displayDialog(item.identity, item.platform)"
                        >
                            <EVMpAccountItem v-if="item.platform === 'EVM+'" :size="70" :address="item.identity" />
                            <AccountItem v-else :size="70" :chain="item.platform" :address="item.identity" />
                            <span class="text-lg font-semibold truncate">{{ getDisplayAddress(item) }}</span>
                            <section class="flex flex-row flex-shrink-0 gap-4">
                                <i
                                    class="
                                        bx
                                        bxs-copy
                                        bx-sm
                                        text-primary-text
                                        opacity-70
                                        transform
                                        active:-translate-y-px
                                    "
                                    @click.stop="copyToClipboard(item.identity)"
                                />
                                <i
                                    class="
                                        bx bx-link-external bx-sm
                                        text-primary-text
                                        opacity-70
                                        transform
                                        active:-translate-y-px
                                    "
                                    @click.stop="toExternalLink(item.identity, item.platform)"
                                />
                            </section>
                        </div>
                    </div>
                </template>
            </TransBarCard>
        </div>
        <AccountModal
            :isShowingAccount="isShowingAccount"
            :showingAccountDetails="showingAccountDetails"
            @closeDialog="closeAccountDialog"
        />
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
import TransBarCard from '@/components/Card/TransBarCard.vue';
import AccountModal from '@/components/Account/AccountModal.vue';
import { DetailedAccount } from '@/common/types';
import { formatter } from '@/common/address';

@Options({
    name: 'Accounts',
    components: { EVMpAccountItem, Button, AccountItem, Header, TransBarCard, AccountModal },
})
export default class Accounts extends Vue {
    isOwner: boolean = false;
    accounts: DetailedAccount[] = [];
    lastRoute: string = '';
    rss3Profile: RSS3Profile = {};
    isShowingAccount: boolean = false;
    showingAccountDetails: {
        address: string;
        platform: string;
        isLink: boolean;
        link?: string;
    } = {
        address: '',
        platform: 'EVM+',
        isLink: false,
    };

    async mounted() {
        await this.initLoad();
    }

    async initLoad() {
        const addrOrName = utils.getAddress(<string>this.$route.params.address);
        const pageOwner = await RSS3.setPageOwner(addrOrName);
        this.isOwner = RSS3.isNowOwner();

        utils.subDomainModeRedirect(pageOwner.name);

        if (pageOwner.profile) {
            this.rss3Profile = pageOwner.profile;
        }

        const { listed } = await utils.initAccounts();
        const accountDetails = listed.map((account) => RSS3Utils.id.parseAccount(account.id));
        this.accounts = [
            {
                platform: 'EVM+',
                identity: pageOwner.address,
            },
        ].concat(accountDetails);
    }

    displayDialog(address: string, platform: string) {
        if (ContentProviders[platform]) {
            this.showingAccountDetails = {
                address:
                    (ContentProviders[platform].prefix || '') + address + (ContentProviders[platform].suffix || ''),
                platform,
                isLink: true,
                link: ContentProviders[platform].getAccountLink(address),
            };
        } else {
            this.showingAccountDetails = {
                address,
                platform,
                isLink: false,
            };
        }

        this.isShowingAccount = true;
    }

    getDisplayAddress(account: DetailedAccount) {
        if (account.platform === 'Misskey' && account.identity.length <= 14) {
            return account.identity;
        } else {
            return formatter(account.identity);
        }
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
            case 'Jike':
                window.open(ContentProviders[platform].getAccountLink(address));
                break;
            case 'Misskey':
                window.open(ContentProviders[platform].getAccountLink(address));
                break;
            case 'Twitter':
                window.open(ContentProviders[platform].getAccountLink(address));
                break;
        }
    }

    closeAccountDialog() {
        this.isShowingAccount = false;
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
