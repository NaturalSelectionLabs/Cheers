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
            v-bind:class="[isFollowing ? 'bg-primary text-white' : 'bg-white text-primary']"
            @click="isFollowing = !isFollowing"
        >
            <span>{{ isFollowing ? 'Follow' : 'Following' }}</span>
            <i class="bx bx-sm" v-bind:class="[isFollowing ? 'bx-plus' : 'bx-check']"></i>
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
                <i class="bx bx-info-circle" style="color: rgba(0, 0, 0, 0.2)" />
            </template>
            <template #header-button>
                <Button
                    size="sm"
                    class="w-10 h-10 text-account-button bg-white shadow-account-sm"
                    @click="toAccountsPage"
                >
                    <i class="bx bx-expand-alt bx-xs"></i>
                </Button>
            </template>
            <template #content>
                <AccountItem
                    class="inline-block mr-1"
                    size="70"
                    :chain="item.platform"
                    v-for="(item, index) in accounts"
                    :key="index"
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
                <i class="bx bx-info-circle" style="color: rgba(0, 0, 0, 0.2)" />
            </template>
            <template #header-button>
                <Button size="sm" class="w-10 h-10 text-nft-button bg-white shadow-nft-sm" @click="toNFTsPage">
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
                <i class="bx bx-info-circle" style="color: rgba(0, 0, 0, 0.2)" />
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
import { RSS3Account, RSS3Asset } from 'rss3-next/types/rss3';
import { DetailedNFT, RSS3AssetShow } from '@/common/types';

interface ProfileInfo {
    avatar: string;
    username: string;
    address: string;
    bio: string;
}

interface Relations {
    followers: Array<Object>;
    followings: Array<Object>;
}

@Options({
    components: { Button, Card, Profile, AccountItem, NFTItem },
})
export default class Home extends Vue {
    public isFollowing: boolean = true;
    public isOwner: boolean = false;

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

    async mounted() {
        const rss3 = await RSS3.visitor();
        const owner: string = <string>rss3.account.address;

        let address: string;
        if (this.$route.params.address) {
            address = <string>this.$route.params.address;
            if (address === owner) {
                this.isOwner = true;
            }
        } else {
            // address = 'RSS3 Address';
            if (!(await RSS3.reconnect())) {
                await this.$router.push('/');
            }
            address = owner;
            this.isOwner = true;
        }

        // const profile = await rss3.profile.get(address);
        //
        // this.rss3Profile.avatar = profile?.avatar?.[0] || '';
        // this.rss3Profile.username = profile?.name || '';
        // this.rss3Profile.bio = profile?.bio || '';
        // this.rss3Profile.address = address;

        const data = await RSS3.getAssetProfile(address);

        const profile = data.rss3File.profile;

        this.rss3Profile.avatar = profile?.avatar?.[0] || '';
        this.rss3Profile.username = profile?.name || '';
        this.rss3Profile.bio = profile?.bio || '';
        this.rss3Profile.address = address;

        if (data) {
            this.accounts.push({
                platform: 'Ethereum',
                identity: rss3.account.address,
                signature: '',
                tags: ['order:-1'],
            });
            await this.loadAccounts(<RSS3Account[]>data.rss3File.accounts);

            // await this.loadAssets(data);
            data.assets.ethereum.forEach((item: { nft: any[] }, aid: any) => {
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
            this.rss3Relations['followers'] = await rss3?.backlinks.get(address, 'following');
            this.rss3Relations['followings'] = (await rss3?.links.get(address, 'following'))?.list || [];
        }, 0);
    }

    getTaggedOrder(taggedElement: RSS3Account | RSS3Asset): number {
        if (!taggedElement.tags) {
            return -1;
        }
        const orderPattern = /^order:(-?\d+)$/i;
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

    public toAccountsPage() {
        this.$router.push(`/${this.rss3Profile['address']}/accounts`);
    }

    public toNFTsPage() {
        this.$router.push(`/${this.rss3Profile['address']}/nfts`);
    }

    public toSinglenftPage(account: string, index: number) {
        const address = <string>this.rss3Profile.address;
        this.$router.push(`/${address}/singlenft/${account}/${index}`);
    }

    public toSetupPage() {
        this.$router.push(`/setup`);
    }
}
</script>

<style></style>
