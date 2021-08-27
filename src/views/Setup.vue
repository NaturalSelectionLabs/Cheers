<template>
    <div class="px-4 py-9 max-w-md m-auto pb-20">
        <div class="text-center mb-4">
            <h1 class="text-5xl text-primary font-bold">Setup</h1>
        </div>
        <AvatarEditor class="m-auto mb-4" size="lg" :url="profile.avatar" ref="avatar" />
        <Input class="mb-4 w-full" :is-single-line="true" placeholder="Username" v-model="profile.name" />
        <Input class="mb-4 w-full" :is-single-line="false" placeholder="Bio" v-model="profile.bio" />
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
                <Button
                    size="sm"
                    v-if="!isMobile"
                    class="w-10 h-10 bg-account-button text-white shadow-account"
                    @click="toManageAccounts"
                >
                    <i class="bx bx-plus bx-sm" />
                </Button>
            </template>
            <template #content>
                <AccountItem class="shadow-account-sm inline-flex m-0.5 rounded-full" size="64" chain="Ethereum" />
                <AccountItem
                    v-for="account in accounts"
                    :key="account.platform + account.identity"
                    class="shadow-account-sm inline-flex m-0.5 rounded-full"
                    size="64"
                    :chain="account.platform"
                />
            </template>
        </Card>
        <Card
            title="NFTs"
            color-title="text-nft-title"
            color-tips="text-nft-title"
            color-background="bg-nft-bg"
            class="mb-4 w-full"
            :is-having-content="assets.length !== 0"
            :is-single-line="assets.length !== 0"
            :tips="assets.length === 0 ? 'You don’t have any NFTs yet : {' : ''"
        >
            <template #header-button>
                <Button
                    size="sm"
                    class="w-10 h-10 bg-nft-button text-white shadow-nft"
                    v-if="assets.length !== 0"
                    @click="toManageNFTs"
                >
                    <i class="bx bx-pencil bx-sm" />
                </Button>
            </template>
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
            title="Contents"
            color-title="text-content-title"
            color-tips="text-content-title"
            color-background="bg-content-bg"
            class="mb-4 w-full"
            :is-having-content="true"
        >
            <template #content>
                <div class="flex justify-center">
                    <Button
                        size="lg"
                        class="
                            text-lg
                            font-extralight
                            bg-content-button
                            opacity-35
                            text-white
                            shadow-content
                            cursor-not-allowed
                            m-auto
                        "
                        disabled
                    >
                        Coming Soon
                    </Button>
                </div>
            </template>
        </Card>
        <div class="px-4 py-4 flex gap-5 fixed bottom-0 left-0 right-0 max-w-md m-auto w-full">
            <Button size="lg" class="flex-1 text-lg bg-white text-primary shadow-secondary" @click="back">Back</Button>
            <Button size="lg" class="flex-1 text-lg bg-primary text-white shadow-primary" @click="save">Done</Button>
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
import { RSS3Account, RSS3Asset, RSS3Profile } from 'rss3-next/types/rss3';
import RSS3, { IRSS3 } from '@/common/rss3';

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
    profile: {
        avatar: string;
        name: string;
        bio: string;
    } = {
        avatar: '',
        name: '',
        bio: '',
    };
    accounts: RSS3Account[] = [];
    assets: RSS3Asset[] = [];
    rss3: IRSS3 | null = null;

    isMobile: Boolean = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    async mounted() {
        if (!RSS3.isValidRSS3()) {
            await this.$router.push('/');
        } else {
            this.rss3 = await RSS3.get();
        }
        if (!this.loadEdited()) {
            const profile = await (<IRSS3>this.rss3).profile.get();
            console.log(profile);
            this.profile.avatar = profile?.avatar?.[0] || '';
            this.profile.name = profile?.name || '';
            this.profile.bio = profile?.bio || '';
        }
    }

    loadEdited() {
        if (localStorage.getItem('profile')) {
            this.profile = JSON.parse(localStorage.getItem('profile') || '');
            return true;
        } else {
            return false;
        }
    }
    saveEdited() {
        localStorage.setItem('profile', JSON.stringify(this.profile));
    }
    clearEdited() {
        localStorage.removeItem('profile');
    }

    toManageAccounts() {
        this.saveEdited();
        this.$router.push('/setup/accounts');
    }
    toManageNFTs() {
        this.saveEdited();
        this.$router.push('/manage/nfts');
    }
    back() {
        this.clearEdited();
        window.history.back();
    }
    async save() {
        if (!this.rss3) {
            this.rss3 = await RSS3.get();
        }
        const newProfile: RSS3Profile = {
            name: this.profile.name,
            bio: this.profile.bio,
        };
        const avatarUrl = await (<any>this.$refs.avatar).upload();
        if (avatarUrl) {
            newProfile.avatar = [avatarUrl];
        }
        await (<IRSS3>this.rss3).profile.patch(newProfile);
        await (<IRSS3>this.rss3).files.sync();
        this.clearEdited();
        await this.$router.push('/public');
    }
}
</script>

<style lang="postcss" scoped></style>
