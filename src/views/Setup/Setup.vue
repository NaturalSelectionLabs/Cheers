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
                    :size="64"
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
            :is-having-content="nfts.length !== 0"
            :is-single-line="nfts.length !== 0"
            :tips="nfts.length === 0 ? 'You don’t have any NFTs yet : {' : ''"
        >
            <template #header-button>
                <Button
                    size="sm"
                    class="w-10 h-10 bg-nft-button text-white shadow-nft"
                    v-if="nfts.length !== 0"
                    @click="toManageNFTs"
                >
                    <i class="bx bx-pencil bx-sm" />
                </Button>
            </template>
            <template #content>
                <NFTItem
                    v-for="asset in nfts"
                    :key="asset.platform + asset.identity + asset.id"
                    class="shadow-nft-sm inline-flex m-0.5"
                    :size="64"
                    :image-url="asset.info.animation_url || asset.info.image_preview_url"
                />
            </template>
        </Card>
        <Card
            title="Donations"
            color-title="text-gitcoin-title"
            color-tips="text-gitcoin-title"
            color-background="bg-gitcoin-bg"
            class="mb-4 w-full"
            :is-having-content="gitcoins.length !== 0"
            :is-single-line="gitcoins.length !== 0"
            :tips="gitcoins.length === 0 ? 'You don’t have any donations yet :(' : ''"
        >
            <template #header-button>
                <Button
                    size="sm"
                    class="w-10 h-10 bg-gitcoin-button text-white shadow-nft"
                    v-if="gitcoins.length !== 0"
                    @click="toManageGitcoins"
                >
                    <i class="bx bx-pencil bx-sm" />
                </Button>
            </template>
            <template #content>
                <NFTItem
                    v-for="asset in gitcoins"
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
        <LoadingContainer v-show="isLoading" />

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
import LoadingContainer from '@/components/LoadingContainer.vue';
import { RSS3Account, RSS3Asset, RSS3Profile } from 'rss3-next/types/rss3';
import RSS3, { IRSS3 } from '@/common/rss3';
import config from '@/config';

import { GeneralAsset, GeneralAssetWithTags } from '@/common/types';

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
        LoadingContainer,
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
    nfts: GeneralAssetWithTags[] = [];
    gitcoins: GeneralAssetWithTags[] = [];
    rss3: IRSS3 | null = null;
    isLoading: Boolean = false;
    maxValueLength: Number = 280;
    notice: String = '';
    isShowingNotice: Boolean = false;

    $gtag: any;

    async mounted() {
        if (!(await RSS3.reconnect())) {
            sessionStorage.setItem('redirectFrom', this.$route.fullPath);
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

        const data = await RSS3.getAssetProfile((<IRSS3>this.rss3).account.address);
        if (!data) {
            return;
        }

        const profile = data.rss3File.profile;

        if (profile?.avatar?.[0]) {
            const favicon = <HTMLLinkElement>document.getElementById('favicon');
            favicon.href = profile.avatar[0];
        }
        if (profile?.name) {
            document.title = profile.name;
        }

        if (data) {
            // Push original account
            this.accounts.push({
                platform: 'Ethereum',
                identity: (<IRSS3>this.rss3).account.address,
                signature: '',
                tags: ['pass:order:-1'],
            });

            await this.loadAccounts(<RSS3Account[]>data.rss3File.accounts);
            await this.loadAssets(<RSS3Asset[]>data.rss3File.assets, <GeneralAsset[]>data.assets);
        }
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

    private getAssetOrder(nft: RSS3Asset) {
        let order = -1;
        nft.tags?.forEach((tag: string) => {
            if (tag.startsWith('pass:order:')) {
                order = parseInt(tag.substr(11));
            }
        });
        return order;
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

    async loadAssets(assetsInRSS3File: RSS3Asset[], assetsGrabbed: GeneralAsset[]) {
        const assetsMerge: GeneralAssetWithTags[] = await Promise.all(
            (assetsGrabbed || []).map(async (ag: GeneralAssetWithTags) => {
                const origType = ag.type;
                ag.type = 'Invalid'; // Using as a match mark
                for (const airf of assetsInRSS3File) {
                    if (
                        airf.platform === ag.platform &&
                        airf.identity === ag.identity &&
                        airf.id === ag.id &&
                        airf.type === origType
                    ) {
                        // Matched
                        ag.type = origType; // Recover type
                        if (airf.tags) {
                            ag.tags = airf.tags;
                        }
                        break;
                    }
                }
                return ag;
            }),
        );

        const NFTList: GeneralAssetWithTags[] = [];
        const GitcoinList: GeneralAssetWithTags[] = [];

        for (const am of assetsMerge) {
            if (am.type === 'NFT') {
                NFTList.push(am);
            } else if (am.type === 'Gitcoin-Donation') {
                GitcoinList.push(am);
            } // else Invalid
        }

        this.nfts = NFTList.filter((asset) => !asset.tags || asset.tags.indexOf('pass:hidden') === -1).sort(
            (a, b) => this.getAssetOrder(a) - this.getAssetOrder(b),
        );
        this.gitcoins = GitcoinList.filter((asset) => !asset.tags || asset.tags.indexOf('pass:hidden') === -1).sort(
            (a, b) => this.getAssetOrder(a) - this.getAssetOrder(b),
        );
    }

    loadEdited() {
        if (sessionStorage.getItem('profile')) {
            this.profile = JSON.parse(sessionStorage.getItem('profile') || '');
            return true;
        } else {
            return false;
        }
    }
    saveEdited() {
        sessionStorage.setItem('profile', JSON.stringify(this.profile));
    }
    clearEdited() {
        sessionStorage.removeItem('profile');
    }

    toManageAccounts() {
        this.saveEdited();
        this.$router.push('/setup/accounts');
    }
    toManageNFTs() {
        this.saveEdited();
        this.$router.push('/setup/nfts');
    }
    toManageGitcoins() {
        this.$router.push('/setup/gitcoins');
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
        const redirectFrom = sessionStorage.getItem('redirectFrom');
        sessionStorage.removeItem('redirectFrom');
        await this.$router.push(redirectFrom || '/home');
    }
}
</script>

<style lang="postcss" scoped></style>
