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
            v-if="isFollowing"
            size="sm"
            class="w-auto text-lg bg-primary text-white shadow-secondary mb-4"
            @click="isFollowing = !isFollowing"
        >
            <span>Follow</span>
            <i class="bx bx-plus bx-sm"></i>
        </Button>
        <Button
            v-else
            size="sm"
            class="w-auto text-lg bg-white text-primary shadow-secondary mb-4"
            @click="isFollowing = !isFollowing"
        >
            <span>Following</span>
            <i class="bx bx-check bx-sm"></i>
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
                    :chain="item.chain"
                    v-for="(item, index) in accountList"
                    :key="index"
                ></AccountItem>
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
                    class="inline-block mr-1"
                    v-for="id in 8"
                    :key="id"
                    imageUrl="https://i.imgur.com/GdWEt4z.jpg"
                    :size="70"
                    @click="toSinglenftPage"
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

@Options({
    components: { Button, Card, Profile, AccountItem, NFTItem },
})
export default class Home extends Vue {
    public isFollowing: boolean = true;
    public rss3Profile = {
        avatar: 'https://i.imgur.com/GdWEt4z.jpg',
        username: 'Fendiiii',
        address: 'RSS3 Address',
        bio: 'Cutest cat in the world',
    };
    public rss3Relations: Object = {
        followers: [
            {
                avatar: 'https://i.imgur.com/GdWEt4z.jpg',
                username: 'Fendiiii',
                address: '98765tgdusgakdgetg',
                bio: 'Cutest cat in the world',
            },
            {
                avatar: 'https://i.imgur.com/GdWEt4z.jpg',
                username: 'Fendiiii',
                address: '98765tgdusgakdgetg',
                bio: 'Cutest cat in the world',
            },
        ],
        followings: [
            {
                avatar: 'https://i.imgur.com/GdWEt4z.jpg',
                username: 'Fendiiii',
                address: '98765tgdusgakdgetg',
                bio: 'Cutest cat in the world',
            },
            {
                avatar: 'https://i.imgur.com/GdWEt4z.jpg',
                username: 'Fendiiii',
                address: '98765tgdusgakdgetg',
                bio: 'Cutest cat in the world',
            },
            {
                avatar: 'https://i.imgur.com/GdWEt4z.jpg',
                username: 'Fendiiii',
                address: '98765tgdusgakdgetg',
                bio: 'Cutest cat in the world',
            },
        ],
    };
    public accountList: Object = [
        { chain: 'Ethereum', address: '98765tgdusgakdgetg' },
        { chain: 'BSC', address: '98765tgdusgakdgetg' },
        { chain: 'Ronin', address: '98765tgdusgakdgetg' },
    ];
    public toAccountsPage() {
        this.$router.push(`/${this.rss3Profile['address']}/accounts`);
    }
    public toNFTsPage() {
        this.$router.push(`/${this.rss3Profile['address']}/nfts`);
    }
    public toSinglenftPage() {
        this.$router.push(`/singlenft`);
    }
}
</script>

<style></style>
