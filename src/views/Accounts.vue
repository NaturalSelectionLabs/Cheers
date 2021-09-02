<template>
    <div class="h-screen bg-account-bg overflow-y-auto">
        <div class="main px-4 py-8 max-w-md m-auto">
            <div class="header flex justify-between items-center pb-4">
                <Button size="sm" class="w-10 h-10 bg-white text-primary shadow-secondary" @click="back">
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
                <div class="section-title text-2xl text-account-title font-bold text-center">Accounts</div>
                <ImgHolder
                    class="w-10 h-10 inline-flex my-auto cursor-pointer"
                    :is-rounded="true"
                    :is-border="false"
                    :src="this.rss3Profile.avatar"
                    :alt="this.rss3Profile.username"
                    @click="toEtherScan(this.rss3Profile.address)"
                />
            </div>
            <div class="account-list">
                <div class="flex flex-col gap-y-4">
                    <div
                        class="account-wrapper flex flex-row justify-between items-center"
                        v-for="(item, index) in accounts"
                        :key="index"
                    >
                        <AccountItem size="70" :chain="item.platform"></AccountItem>
                        <span class="address text-2xl font-semibold">{{ filter(item.identity) }}</span>
                        <Button
                            size="sm"
                            class="w-10 h-10 bg-account-button text-white shadow-account"
                            @click="copyToClipboard(item.identity)"
                        >
                            <i class="bx bxs-copy bx-sm"></i>
                        </Button>
                        <Button
                            size="sm"
                            class="w-10 h-10 bg-account-button text-white shadow-account"
                            @click="toEtherScan(item.identity)"
                        >
                            <i class="bx bx-link-external bx-sm"></i>
                        </Button>
                    </div>
                </div>
            </div>
            <div class="px-4 py-4 flex gap-5 fixed bottom-0 left-0 right-0 max-w-md m-auto w-full" v-if="isOwner">
                <Button
                    size="lg"
                    class="m-auto text-lg bg-account-button text-white shadow-account"
                    @click="toSetupAccounts"
                >
                    Manage Accounts
                </Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import ImgHolder from '@/components/ImgHolder.vue';
import AccountItem from '@/components/AccountItem.vue';
import RSS3 from '@/common/rss3';
import { RSS3Account } from 'rss3-next/types/rss3';

interface Profile {
    avatar: string;
    username: string;
    address: string;
    bio: string;
}

@Options({
    components: { ImgHolder, Button, AccountItem },
})
export default class Accounts extends Vue {
    public isOwner: boolean = false;
    public accounts: RSS3Account[] = [];
    public rss3Profile: Profile = {
        avatar: '',
        username: '',
        address: '',
        bio: '',
    };

    async mounted() {
        const rss3 = await RSS3.visitor();
        const address: string = <string>this.$route.params.address;
        const owner: string = <string>rss3.account.address;
        // const owner: string = 'RSS3 Address';

        if (owner === address) {
            this.isOwner = true;
        }

        const profile = await rss3.profile.get(address);
        this.rss3Profile.avatar = profile?.avatar?.[0] || '';
        this.rss3Profile.username = profile?.name?.[0] || '';
        this.rss3Profile.address = address;

        this.accounts.push({
            platform: 'Ethereum',
            identity: <string>this.$route.params.address,
            signature: '',
            tags: ['pass:order:-1'],
        });

        const accounts = await rss3.accounts.get();
        await this.loadAccounts(accounts);
    }
    /**
     * filter
     */
    public filter(address: string) {
        let res: string = address.slice(0, 6);
        res += '....';
        res += address.slice(-4);
        return res;
    }

    public copyToClipboard(address: string) {
        navigator.clipboard.writeText(address).then(
            function () {
                console.log('Async: Copying to clipboard was successful!');
            },
            function (err) {
                console.error('Async: Could not copy the account: ', err);
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

    public toEtherScan(address: string) {
        // this.$router.push(`/${address}`);
        window.open(`https://etherscan.io/address/${address}`);
    }

    public toSetupAccounts() {
        this.$router.push(`/setup/accounts`);
    }

    public back() {
        window.history.back();
    }
}
</script>

<style></style>
