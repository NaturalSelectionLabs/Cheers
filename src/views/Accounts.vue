<template>
    <div class="h-screen bg-account-bg overflow-y-auto">
        <div class="main px-4 py-8 max-w-md m-auto">
            <div class="header flex justify-between items-center pb-4">
                <Button
                    size="sm"
                    class="w-10 h-10 bg-secondary-btn text-secondary-btn-text shadow-secondary-btn"
                    @click="back"
                >
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
                <div class="section-title text-2xl text-account-title font-bold text-center">Accounts</div>
                <ImgHolder
                    class="w-10 h-10 inline-flex my-auto cursor-pointer"
                    :is-rounded="true"
                    :is-border="false"
                    :src="rss3Profile.avatar"
                    :alt="rss3Profile.username"
                    @click="toPublicPage(rss3Profile.address)"
                />
            </div>
            <div class="account-list">
                <div class="flex flex-col gap-y-4" :class="{ 'pb-16': isOwner }">
                    <div
                        class="account-wrapper flex flex-row justify-between items-center"
                        v-for="item in accounts"
                        :key="item.platform + item.identity"
                    >
                        <AccountItem :size="70" :chain="item.platform"></AccountItem>
                        <span class="address text-2xl text-account-title font-semibold">{{
                            filter(item.identity)
                        }}</span>
                        <Button
                            size="sm"
                            class="w-10 h-10 bg-account-btn-m text-account-btn-m-text shadow-account-btn-m"
                            @click="copyToClipboard(item.identity)"
                        >
                            <i class="bx bxs-copy bx-sm"></i>
                        </Button>
                        <Button
                            size="sm"
                            class="w-10 h-10 bg-account-btn-m text-account-btn-m-text shadow-account-btn-m"
                            @click="toExternalLink(item.identity, item.platform)"
                        >
                            <i class="bx bx-link-external bx-sm"></i>
                        </Button>
                    </div>
                </div>
            </div>
            <div class="px-4 py-4 flex gap-5 fixed bottom-2 left-0 right-0 max-w-md m-auto w-full" v-if="isOwner">
                <Button
                    size="lg"
                    class="m-auto text-lg bg-account-btn-m text-account-btn-m-text shadow-account-btn-m"
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
import AccountItem from '@/components/AccountItem.vue';
import RSS3, { IRSS3 } from '@/common/rss3';
import { RSS3Account } from 'rss3-next/types/rss3';
import RNSUtils from '@/common/rns';
import config from '@/config';

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

    async mounted() {
        const address = <string>this.$route.params.address;
        if (!address.startsWith('0x')) {
            this.rns = address;
            this.ethAddress = (await RNSUtils.name2Addr(`${address}.pass3.me`)).toString();
        } else {
            this.ethAddress = address;
            this.rns = await RNSUtils.addr2Name(address);
        }
        const rss3 = await RSS3.visitor();
        const owner: string = <string>rss3.account.address;
        // const owner: string = 'RSS3 Address';

        if (owner === this.ethAddress) {
            this.isOwner = true;
        }

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

        this.accounts.push({
            platform: 'Ethereum',
            identity: this.ethAddress,
            signature: '',
            tags: ['pass:order:-1'],
        });

        const accounts = await rss3.accounts.get(this.ethAddress);
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

    public toPublicPage(address: string) {
        this.$router.push(`/${address}`);
    }

    public toExternalLink(address: string, platform: string) {
        switch (platform) {
            case 'BSC':
                window.open(`https://bscscan.com/address/${address}`);
                break;
            case 'Ethereum':
                window.open(`https://etherscan.io/address/${address}`);
                break;
        }
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
