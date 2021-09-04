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
                    class="w-10 h-10 bg-account-button text-white shadow-account"
                    @click="toManageAccounts"
                >
                    <i class="bx bx-pencil bx-sm" />
                </Button>
            </template>
            <template #content>
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
        <!-- <Modal v-show="isLoading">
            <template #body>
                <span
                    class="
                        text-9xl text-primary
                        opacity-50
                        block
                        absolute
                        top-1/2
                        left-1/2
                        transform
                        -translate-x-1/2 -translate-y-1/2
                    "
                >
                    <i class="bx bx-loader-alt bx-spin"></i>
                </span>
            </template>
        </Modal> -->
        <div
            v-show="isLoading"
            class="fixed w-screen h-screen m-0 p-0 top-0 left-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
            <Loading size="200" />
        </div>
        <Modal v-if="isShowingNotice">
            <template #header>
                <h1>Oops!</h1>
            </template>
            <template #body>
                <p class="mt-1 p-4">
                    {{ notice }}
                </p>
            </template>
            <template #footer>
                <div class="flex flex-row gap-5">
                    <Button
                        size="sm"
                        class="w-72 bg-primary text-white shadow-primary"
                        @click="isShowingNotice = false"
                    >
                        OK
                    </Button>
                </div>
            </template>
        </Modal>
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
import Modal from '@/components/Modal.vue';
import Loading from '@/components/Loading.vue';
import { RSS3Account, RSS3Asset, RSS3Profile } from 'rss3-next/types/rss3';
import RSS3, { IRSS3 } from '@/common/rss3';
import config from '@/config';

import { DetailedNFT, RSS3AssetShow } from '@/common/types';

@Options({
    components: {
        Modal,
        Button,
        AvatarEditor,
        Card,
        AccountItem,
        NFTItem,
        Input,
        Loading,
    },
})
export default class Setup extends Vue {
    profile: {
        avatar: string;
        name: string;
        bio: string;
    } = {
        avatar: config.defaultAvatar,
        name: '',
        bio: '',
    };
    accounts: RSS3Account[] = [];
    assets: RSS3AssetShow[] = [];
    rss3: IRSS3 | null = null;
    isLoading: Boolean = false;
    maxValueLength: Number = 280;
    notice: String = '';
    isShowingNotice: Boolean = false;

    $gtag: any;

    async mounted() {
        if (!(await RSS3.reconnect())) {
            localStorage.setItem('redirectFrom', this.$route.fullPath);
            await this.$router.push('/');
        } else {
            this.rss3 = await RSS3.get();
        }
        if (!this.loadEdited()) {
            const profile = await (<IRSS3>this.rss3).profile.get();
            console.log(profile);
            this.profile.avatar = profile?.avatar?.[0] || config.defaultAvatar;
            this.profile.name = profile?.name || '';
            this.profile.bio = profile?.bio || '';
        }

        await this.loadAccounts();
        await this.loadAssets();
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

    async loadAccounts() {
        // Add original account
        this.accounts.push({
            platform: 'Ethereum',
            identity: (<IRSS3>this.rss3).account.address,
            signature: '',
            tags: ['pass:order:-1'],
        });
        // Get accounts
        const accounts = await (<IRSS3>this.rss3).accounts.get((<IRSS3>this.rss3).account.address);
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

    async loadAssets() {
        const data = await RSS3.getAssetProfile((<IRSS3>this.rss3).account.address);
        if (!data) {
            return;
        }
        const queriedAssets: RSS3AssetShow[] = []; // Real-time NFTs queried from asset
        for (const key in data.assets) {
            // key: ethereum / bsc / ...
            data.assets[key].forEach((account: any) => {
                account.nft?.forEach((nft: DetailedNFT) => {
                    const aNFT: RSS3AssetShow = {
                        tags: [],
                        platform: nft.chain,
                        identity: nft.asset_contract.address,
                        id: nft.token_id,
                        image_url: nft.image_url,
                        order: 0,
                    };
                    queriedAssets.push(aNFT);
                });
            });
        }

        const filedAssets: RSS3Asset[] = data.rss3File.assets || []; // NFTs cached in RSS3 file `asset`

        queriedAssets.forEach((nft: RSS3AssetShow) => {
            const i = filedAssets.findIndex(
                (fn) => nft.platform === fn.platform && nft.identity === fn.identity && nft.id === fn.id,
            );
            if (i !== -1) {
                if (!nft.tags) {
                    nft.tags = [];
                }
                nft.tags.push(...(filedAssets[i].tags || []));
                nft.tags.forEach((tag: string) => {
                    if (tag.startsWith('pass:order:')) {
                        nft.order = parseInt(tag.substr(11), 10);
                    }
                });
                if (!nft.tags.includes('hidden')) {
                    // Show
                    this.assets.push(nft);
                }
                filedAssets.splice(i, 1); // Remains are gone NFTs
            } else {
                // Newly added
                nft.order = -1;
                this.assets.push(nft);
            }
        });

        this.assets.sort((a, b) => {
            return a.order - b.order;
        });
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
        this.$router.push('/setup/nfts');
    }
    async back() {
        this.clearEdited();
        this.$gtag.event('cancelEditProfile', { userid: (<IRSS3>this.rss3).account.address });
        await RSS3.getAssetProfile((<IRSS3>this.rss3).account.address, true);
        window.history.back();
    }
    async save() {
        this.isLoading = true;
        if (!this.rss3) {
            this.rss3 = await RSS3.get();
        }
        if (this.profile.name.length > this.maxValueLength) {
            this.notice = `Name cannot be longer than ${this.maxValueLength} chars`;
            this.isLoading = false;
            this.isShowingNotice = true;
            return;
        }
        if (this.profile.bio.length > this.maxValueLength) {
            this.notice = `Bio cannot be longer than ${this.maxValueLength} chars`;
            this.isLoading = false;
            this.isShowingNotice = true;
            return;
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
        try {
            await (<IRSS3>this.rss3).files.sync();
        } catch (e) {
            console.log(e);
            this.isLoading = false;
            return;
        }
        this.clearEdited();
        await RSS3.getAssetProfile((<IRSS3>this.rss3).account.address, true);
        this.$gtag.event('finishEditProfile', { userid: (<IRSS3>this.rss3).account.address });
        this.isLoading = false;
        const redirectFrom = localStorage.getItem('redirectFrom');
        localStorage.removeItem('redirectFrom');
        await this.$router.push(redirectFrom || '/home');
    }
}
</script>

<style lang="postcss" scoped></style>
