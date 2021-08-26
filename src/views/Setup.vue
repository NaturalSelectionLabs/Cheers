<template>
    <div class="px-4 py-9 max-w-md m-auto">
        <div class="text-center mb-4">
            <h1 class="text-5xl text-primary font-bold">Setup</h1>
        </div>
        <AvatarEditor class="m-auto mb-4" size="lg" />
        <Input class="mb-4 w-full" :is-single-line="true" placeholder="Username" v-model="username" />
        <Input class="mb-4 w-full" :is-single-line="false" placeholder="Bio" v-model="bio" />
        <Card
            title="Accounts"
            color-title="text-account-title"
            color-tips="text-account-title"
            color-background="bg-account-bg"
            class="mb-4 w-full"
            :is-having-content="true"
            :is-single-line="true"
        >
            <template #header-button>
                <Button size="sm" class="w-10 h-10 bg-account-button text-white shadow-account">
                    <i class="bx bx-plus bx-sm"></i>
                </Button>
            </template>
            <template #content>
                <AccountItem
                    v-for="account in accounts"
                    :key="account.platform + account.identity"
                    class="shadow-account-sm inline-flex m-0.5"
                    size="64"
                    :chain="account.platform"
                />
            </template>
        </Card>
        <Card
            title="TestCard"
            color-title="text-nft-title"
            color-tips="text-nft-title"
            color-background="bg-nft-bg"
            class="mb-4 w-full"
            :is-having-content="assets.length !== 0"
            :is-single-line="true"
            :tips="assets.length === 0 ? 'You don’t have any NFTs yet : {' : ''"
        >
            <template #content>
                <NFTItem
                    v-for="asset in assets"
                    :key="asset.platform + asset.identity + asset.id"
                    class="shadow-nft-sm inline-flex m-0.5"
                    :size="64"
                    imageUrl=""
                />
            </template>
        </Card>
        <Card
            title="TestCard"
            color-title="text-content-title"
            color-tips="text-content-title"
            color-background="bg-content-bg"
            class="mb-4 w-full"
            :is-having-content="true"
        >
            <template #content>
                <Button
                    size="lg"
                    class="text-xs bg-content-button opacity-35 text-white shadow-content cursor-not-allowed m-auto"
                    disabled
                >
                    Coming Soon
                </Button>
            </template>
        </Card>
        <div class="flex gap-5">
            <Button size="lg" class="flex-1 text-lg bg-white text-primary shadow-secondary">Back</Button>
            <Button size="lg" class="flex-1 text-lg bg-primary text-white shadow-primary">Done</Button>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import AvatarEditor from '@/components/AvatarEditor.vue';
import Card from '@/components/Card.vue';
import AccountItem from '@/components/AccountItem.vue';
import NFTItem from '@/components/NFT/NFTItem.vue';
import Input from '@/components/Input.vue';
import { RSS3Account, RSS3Asset } from 'rss3-next/types/rss3';

@Options({
    components: {
        Button,
        AvatarEditor,
        Card,
        AccountItem,
        NFTItem,
        Input,
    },
})
export default class Setup extends Vue {
    username = '';
    bio = '';
    accounts: RSS3Account[] = [];
    assets: RSS3Asset[] = [];

    async mounted() {}
}
</script>

<style lang="postcss" scoped></style>
