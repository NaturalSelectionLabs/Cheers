<template>
    <div class="main px-4 py-8 flex flex-col gap-y-2 max-w-md m-auto">
        <Profile
            :avatar="rss3Profile.avatar"
            :username="rss3Profile.username"
            :address="rss3Profile.address"
            :followers="rss3Relations.followers"
            :followings="rss3Relations.followings"
            :bio="rss3Profile.bio"
        ></Profile>
        <Button
            size="sm"
            class="w-auto text-lg shadow-secondary mb-4 duration-200"
            v-if="!isOwner"
            v-bind:class="[isFollowing ? 'bg-white text-primary' : 'bg-primary text-white']"
            @click="action()"
        >
            <span>{{ isFollowing ? 'Following' : 'Follow' }}</span>
            <i class="bx bx-sm" v-bind:class="[isFollowing ? 'bx-check' : 'bx-plus']"></i>
        </Button>
        <Button
            size="sm"
            class="w-auto text-lg bg-white text-primary shadow-secondary mb-4"
            v-if="isOwner"
            @click="toSetupPage"
        >
            <span>Edit Profile</span>
            <i class="bx bx-pencil bx-sm"></i>
        </Button>

        <Card
            title="Accounts"
            color-title="text-account-title"
            color-tips="text-account-title"
            color-background="bg-account-bg"
            class="w-auto"
            :is-having-content="true"
            :is-single-line="true"
        >
            <template #accessibility>
                <!-- <i class="bx bx-info-circle" style="color: rgba(0, 0, 0, 0.2)" /> -->
            </template>
            <template #header-button>
                <div v-if="isOwner" class="flex flex-row gap-2">
                    <Button
                        size="sm"
                        class="w-8 h-8 bg-white text-account-button shadow-account-sm"
                        @click="toManageAccounts"
                    >
                        <i class="bx bxs-pencil bx-xs" />
                    </Button>
                    <Button
                        size="sm"
                        class="w-8 h-8 bg-white text-account-button shadow-account-sm"
                        @click="toAccountsPage"
                    >
                        <i class="bx bx-expand-alt bx-xs" />
                    </Button>
                </div>
                <Button
                    v-else
                    size="sm"
                    class="w-10 h-10 text-account-button bg-white shadow-account-sm"
                    @click="toAccountsPage"
                >
                    <i class="bx bx-expand-alt bx-xs"></i>
                </Button>
            </template>
            <template #content>
                <AccountItem
                    class="inline-block mr-1 cursor-pointer"
                    size="70"
                    :chain="item.platform"
                    v-for="(item, index) in accounts"
                    :key="index"
                    @click="displayDialog(item.identity, item.platform)"
                />
            </template>
        </Card>

        <Card
            title="NFTs"
            color-title="text-nft-title"
            color-tips="text-nft-title"
            color-background="bg-nft-bg"
            class="w-auto"
            :is-having-content="true"
            :is-single-line="true"
        >
            <template #accessibility>
                <!-- <i class="bx bx-info-circle" style="color: rgba(0, 0, 0, 0.2)" /> -->
            </template>
            <template #header-button>
                <div v-if="isOwner" class="flex flex-row gap-2">
                    <Button
                        size="sm"
                        class="w-8 h-8 bg-white text-nft-button shadow-nft-sm"
                        v-if="isOwner"
                        @click="toManageNFTs"
                    >
                        <i class="bx bxs-pencil bx-xs" />
                    </Button>
                    <Button size="sm" class="w-8 h-8 bg-white text-nft-button shadow-nft-sm" @click="toNFTsPage">
                        <i class="bx bx-expand-alt bx-xs" />
                    </Button>
                </div>
                <Button v-else size="sm" class="w-10 h-10 text-nft-button bg-white shadow-nft-sm" @click="toNFTsPage">
                    <i class="bx bx-expand-alt bx-xs"></i>
                </Button>
            </template>
            <template #content>
                <NFTItem
                    class="inline-block mr-1 cursor-pointer"
                    v-for="(item, index) in assets"
                    :key="index"
                    :imageUrl="item.nft.image_url"
                    :size="70"
                    @click="toSinglenftPage(item.account, index)"
                ></NFTItem>
            </template>
        </Card>

        <Card
            title="Contents"
            color-title="text-content-title"
            color-tips="text-content-title"
            color-background="bg-content-bg"
            class="w-auto"
            :is-having-content="true"
        >
            <template #accessibility>
                <!-- <i class="bx bx-info-circle" style="color: rgba(0, 0, 0, 0.2)" /> -->
            </template>
            <template #content>
                <Button
                    size="sm"
                    class="
                        text-xs
                        bg-content-button
                        opacity-35
                        text-white
                        shadow-content
                        cursor-not-allowed
                        m-auto
                        mt-4
                    "
                    disabled
                >
                    Coming Soon
                </Button>
            </template>
        </Card>

        <Modal v-show="isdisplaying">
            <template #header>
                <Button
                    size="sm"
                    class="absolute left-4 w-10 h-10 bg-white text-primary shadow-secondary"
                    @click="closeDialog"
                >
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
            </template>
            <template #body>
                <div class="flex flex-col gap-y-4 items-center">
                    <AccountItem class="m-auto mt-4" size="90" :chain="this.dialogChain"></AccountItem>
                    <span class="address text-xl font-semibold break-all text-center mt-4">{{
                        this.dialogAddress
                    }}</span>
                    <Button
                        size="sm"
                        class="text-md bg-account-button text-white shadow-account m-auto mt-4"
                        @click="copyToClipboard(this.dialogAddress)"
                    >
                        Copy
                    </Button>
                </div>
            </template>
        </Modal>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import Card from '@/components/Card.vue';
import Profile from '@/components/Profile.vue';
import AccountItem from '@/components/AccountItem.vue';
import NFTItem from '@/components/NFT/NFTItem.vue';
import RSS3, { IRSS3 } from '@/common/rss3';
import { RSS3Account, RSS3Asset, RSS3Backlink, RSS3ID } from 'rss3-next/types/rss3';
import { DetailedNFT, RSS3AssetShow } from '@/common/types';
import Modal from '@/components/Modal.vue';

interface ProfileInfo {
    avatar: string;
    username: string;
    address: string;
    bio: string;
}

interface Relations {
    followers: RSS3ID[];
    followings: RSS3ID[];
}

@Options({
    components: { Button, Card, Profile, AccountItem, NFTItem, Modal },
})
export default class Home extends Vue {
    public rss3?: IRSS3;
    public isFollowing: boolean = true;
    public isOwner: boolean = false;
    public isdisplaying: boolean = false;
    public dialogAddress: string = '';
    public dialogChain: string = '';

    public rss3Profile: ProfileInfo = {
        avatar: '',
        username: '',
        address: '',
        bio: '',
    };
    public rss3Relations: Relations = {
        followers: [],
        followings: [],
    };
    accounts: RSS3Account[] = [];
    assets: Object[] = [];
    $gtag: any;

    async mounted() {
        const isValidRSS3 = await RSS3.reconnect();
        this.rss3 = await RSS3.visitor();
        const owner: string = <string>this.rss3.account.address;

        let address: string;
        if (this.$route.params.address) {
            address = <string>this.$route.params.address;
            if (address === owner) {
                this.isOwner = true;
            }
        } else {
            // address = 'RSS3 Address';
            if (!isValidRSS3) {
                localStorage.setItem('redirectFrom', this.$route.fullPath);
                await this.$router.push('/');
            }
            address = owner;
            this.isOwner = true;
        }

        const data = await RSS3.getAssetProfile(address);
        if (!data) {
            return;
        }

        // const profile = await rss3.profile.get(address);
        const profile = data.rss3File.profile;
        await this.checkIsFollowing();

        this.rss3Profile.avatar = profile?.avatar?.[0] || '';
        this.rss3Profile.username = profile?.name || '';
        this.rss3Profile.bio = profile?.bio || '';
        this.rss3Profile.address = address;

        this.rss3Relations.followers = await this.rss3?.backlinks.get(address, 'following');
        this.rss3Relations.followings = (await this.rss3?.links.get(address, 'following'))?.list || [];

        if (data) {
            this.accounts.push({
                platform: 'Ethereum',
                identity: address,
                signature: '',
                tags: ['pass:order:-1'],
            });
            await this.loadAccounts(<RSS3Account[]>data.rss3File.accounts);

            // await this.loadAssets(data);
            data.assets.ethereum.forEach((item, aid: any) => {
                item.nft.forEach((nft, i) => {
                    this.assets.push({
                        account: aid,
                        index: i,
                        nft: nft,
                    });
                });
            });
        }

        // Split time-consuming methods from main thread, so it won't stuck the page loading progress
        setTimeout(async () => {
            this.rss3Relations.followers = (await this.rss3?.backlinks.get(address, 'following')) || [];
            this.rss3Relations.followings = (await this.rss3?.links.get(address, 'following'))?.list || [];
        }, 0);
    }

    getTaggedOrder(taggedElement: RSS3Account | RSS3Asset): number {
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

    public async action() {
        if (RSS3.isValidRSS3()) {
            if (this.isFollowing) {
                await this.unfollow();
            } else {
                await this.follow();
            }
            await (<IRSS3>this.rss3).files.sync();
        } else {
            localStorage.setItem('redirectFrom', this.$route.fullPath);
            await this.$router.push('/');
        }
    }

    public async checkIsFollowing() {
        const followList = await this.rss3?.links.get(this.rss3.account.address, 'following');
        if (typeof followList === 'undefined') {
            // No following list. Not following
            this.isFollowing = false;
            return false;
        } else if (followList.list?.includes(<string>this.$route.params.address)) {
            this.isFollowing = true;
            return true;
        } else {
            this.isFollowing = false;
            return false;
        }
    }

    async follow() {
        const rss3 = await RSS3.get();
        if (!(await this.checkIsFollowing())) {
            this.$gtag.event('followFriend', { userid: this.rss3Profile['address'] });
            await rss3?.link.post('following', <string>this.$route.params.address);
        }
        this.isFollowing = true;
    }

    async unfollow() {
        const rss3 = await RSS3.get();
        if (await this.checkIsFollowing()) {
            this.$gtag.event('unfollowFriend', { userid: this.rss3Profile['address'] });
            await rss3?.link.delete('following', this.rss3Profile.address);
        }
        this.isFollowing = false;
    }

    toManageAccounts() {
        this.$router.push('/setup/accounts');
    }
    toManageNFTs() {
        this.$router.push('/setup/nfts');
    }

    public toAccountsPage() {
        this.$gtag.event('visitAccountsPage', { userid: this.rss3Profile['address'] });
        this.$router.push(`/${this.rss3Profile['address']}/accounts`);
    }

    public toNFTsPage() {
        this.$gtag.event('visitNftPage', { userid: this.rss3Profile['address'] });
        this.$router.push(`/${this.rss3Profile['address']}/nfts`);
    }

    public toSinglenftPage(account: string, index: number) {
        const address = <string>this.rss3Profile.address;
        this.$gtag.event('visitSingleNft', { userid: address, nftid: account, nftindex: index });
        this.$router.push(`/${address}/singlenft/${account}/${index}`);
    }

    public toSetupPage() {
        this.$router.push(`/profile`);
    }

    public displayDialog(address: string, chain: string) {
        this.dialogAddress = address;
        this.dialogChain = chain;
        this.isdisplaying = true;
    }

    public closeDialog() {
        this.isdisplaying = false;
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
}
</script>

<style></style>
