<template>
    <div class="px-4 py-9 max-w-md m-auto pb-20">
        <div class="text-center mb-4 relative">
            <Button size="sm" class="w-10 h-10 bg-white text-primary shadow-secondary" @click="back">
                <i class="bx bx-chevron-left bx-sm"></i>
            </Button>
            <h1 class="text-xl text-primary font-bold absolute top-0 leading-10 w-full text-center -z-10">
                Edit Profile
            </h1>
        </div>
        <AvatarEditor class="m-auto mb-4" size="lg" :url="profile.avatar" ref="avatar" />
        <Input class="mb-4 w-full" :is-single-line="true" placeholder="Username" v-model="profile.name" />
        <Input class="mb-4 w-full" :is-single-line="false" placeholder="Bio" v-model="profile.bio" />

        <div class="px-4 py-4 flex gap-5 fixed left-0 right-0 max-w-md m-auto w-full">
            <Button size="lg" class="flex-1 text-lg bg-white text-primary shadow-secondary" @click="back"
                >Discard</Button
            >
            <Button size="lg" class="flex-1 text-lg bg-primary text-white shadow-primary" @click="save">Save</Button>
        </div>
        <Modal v-show="isLoading">
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
import { RSS3Account, RSS3Asset, RSS3Profile } from 'rss3-next/types/rss3';
import RSS3, { IRSS3 } from '@/common/rss3';

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
    },
})
export default class EditProfile extends Vue {
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
    assets: RSS3AssetShow[] = [];
    rss3: IRSS3 | null = null;
    isLoading: Boolean = false;

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
            this.profile.avatar = profile?.avatar?.[0] || '';
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
        const orderPattern = /^order:(-?\d+)$/i;
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
            tags: ['order:-1'],
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

        const filedAssets: RSS3Asset[] = data.rss3File.assets; // NFTs cached in RSS3 file `asset`

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
                    if (tag.startsWith('order:')) {
                        nft.order = parseInt(tag.substr(6), 10);
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
