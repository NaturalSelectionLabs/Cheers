<template>
    <div class="h-screen bg-body-bg text-body-text overflow-y-auto">
        <div class="px-4 py-9 max-w-md m-auto pb-20">
            <div class="text-center mb-4">
                <h1 class="text-5xl text-primary-text font-bold">Setup</h1>
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
                <template #title-icon><AccountIcon /></template>
                <template #header-button>
                    <Button
                        size="sm"
                        class="w-10 h-10 bg-account-btn-m text-account-btn-m-text shadow-account-btn-m"
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
                :tips="isLoadingAssets ? 'Loading...' : nfts.length === 0 ? 'Haven\'t found anything yet...' : ''"
            >
                <template #title-icon><NFTIcon /></template>
                <template #header-button>
                    <Button
                        size="sm"
                        class="w-10 h-10 bg-nft-btn-m text-nft-btn-m-text shadow-nft-btn-m"
                        @click="toManageNFTs"
                    >
                        <i class="bx bx-pencil bx-sm" />
                    </Button>
                </template>
                <template #content>
                    <NFTItem
                        class="inline-flex mx-0.5"
                        v-for="asset in nfts"
                        :key="asset.platform + asset.identity + asset.id"
                        :size="70"
                        :image-url="asset.info.animation_url || asset.info.image_preview_url"
                        :poster-url="asset.info.image_preview_url"
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
                :tips="isLoadingAssets ? 'Loading...' : gitcoins.length === 0 ? 'Haven\'t found anything yet...' : ''"
            >
                <template #title-icon
                    ><GitcoinIcon :iconColor="currentTheme === 'loot' ? 'white' : 'black'"
                /></template>
                <template #header-button>
                    <Button
                        size="sm"
                        class="w-10 h-10 bg-gitcoin-btn-m text-gitcoin-btn-m-text shadow-gitcoin-btn-m"
                        @click="toManageGitcoins"
                    >
                        <i class="bx bx-pencil bx-sm" />
                    </Button>
                </template>
                <template #content>
                    <GitcoinItem
                        class="inline-flex mx-0.5"
                        v-for="item in gitcoins"
                        :key="item.platform + item.identity + item.id"
                        :size="70"
                        :imageUrl="item.info.image_preview_url"
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
                <template #title-icon><ContentIcon /></template>
                <template #content>
                    <div class="flex justify-center">
                        <Button
                            size="lg"
                            class="
                                text-lg
                                bg-content-btn-m
                                opacity-35
                                text-content-btn-m-text
                                shadow-content-btn-m
                                cursor-not-allowed
                                m-auto
                                mt-4
                            "
                            disabled
                        >
                            Coming Soon
                        </Button>
                    </div>
                </template>
            </Card>
            <div
                class="
                    px-4
                    py-4
                    flex
                    justify-between
                    gap-5
                    fixed
                    bottom-0
                    left-0
                    right-0
                    max-w-md
                    m-auto
                    w-full
                    bg-btn-container
                "
            >
                <Button
                    size="lg"
                    class="flex-1 text-lg bg-secondary-btn text-secondary-btn-text shadow-secondary-btn"
                    @click="back"
                    ><span>Back</span></Button
                >
                <Button
                    size="lg"
                    class="flex-1 text-lg bg-primary-btn text-primary-btn-text shadow-primary-btn"
                    @click="save"
                    ><span>Done</span></Button
                >
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
                            class="w-72 bg-primary-btn text-primary-btn-text shadow-primary-btn"
                            @click="isShowingNotice = false"
                        >
                            OK
                        </Button>
                    </div>
                </template>
            </Modal>
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
import Modal from '@/components/Modal.vue';
import Loading from '@/components/Loading.vue';
import LoadingContainer from '@/components/LoadingContainer.vue';
import { RSS3Account, RSS3Asset, RSS3Profile } from 'rss3-next/types/rss3';
import RSS3, { IRSS3 } from '@/common/rss3';
import config from '@/config';

import NFTIcon from '@/components/Icons/NFTIcon.vue';
import GitcoinIcon from '@/components/Icons/GitcoinIcon.vue';
import ContentIcon from '@/components/Icons/ContentIcon.vue';
import AccountIcon from '@/components/Icons/AccountIcon.vue';

import { GeneralAsset, GeneralAssetWithTags } from '@/common/types';
import GitcoinItem from '@/components/GitcoinItem.vue';

@Options({
    name: 'Setup',
    components: {
        GitcoinItem,
        Modal,
        Button,
        AvatarEditor,
        Card,
        AccountItem,
        NFTItem,
        Input,
        Loading,
        LoadingContainer,
        AccountIcon,
        NFTIcon,
        GitcoinIcon,
        ContentIcon,
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
    isLoading: Boolean = true;
    isLoadingAssets: Boolean = true;
    maxValueLength: Number = 280;
    notice: String = '';
    isShowingNotice: Boolean = false;
    currentTheme: string = '';
    $gtag: any;

    async mounted() {
        if (!(await RSS3.reconnect())) {
            sessionStorage.setItem('redirectFrom', this.$route.fullPath);
            await this.$router.push('/');
        } else {
            this.rss3 = await RSS3.get();
        }
        // Trigger force refresh
        await RSS3.getAssetProfile((<IRSS3>this.rss3).account.address, true);
        await (<IRSS3>this.rss3).files.get((<IRSS3>this.rss3).account.address, true);

        const profile = await (<IRSS3>this.rss3).profile.get();
        console.log(profile);
        this.profile.avatar = profile?.avatar?.[0] || config.defaultAvatar;
        this.profile.name = profile?.name || '';
        this.profile.bio = profile?.bio || '';

        if (profile?.avatar?.[0]) {
            const favicon = <HTMLLinkElement>document.getElementById('favicon');
            favicon.href = profile.avatar[0];
        }
        if (profile?.name) {
            document.title = profile.name;
        }

        // Setup theme
        const themes = RSS3.getAvailableThemes(await (<IRSS3>this.rss3).assets.get());
        if (themes[0]) {
            this.currentTheme = themes[0].name;
            document.body.classList.add(themes[0].class);
        } else {
            document.body.classList.remove(...document.body.classList);
        }

        // Push original account
        this.accounts.push({
            platform: 'Ethereum',
            identity: (<IRSS3>this.rss3).account.address,
            signature: '',
            tags: ['pass:order:-1'],
        });

        await this.loadAccounts(await (<IRSS3>this.rss3).accounts.get());

        const data = await RSS3.getAssetProfile((<IRSS3>this.rss3).account.address);
        if (data) {
            await this.loadAssets(await (<IRSS3>this.rss3).assets.get(), <GeneralAsset[]>data.assets);
            this.isLoadingAssets = false;
        }
        this.isLoading = false;
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

    // loadEdited() {
    //     if (sessionStorage.getItem('profile')) {
    //         this.profile = JSON.parse(sessionStorage.getItem('profile') || '');
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }
    // saveEdited() {
    //     sessionStorage.setItem('profile', JSON.stringify(this.profile));
    // }
    // clearEdited() {
    //     sessionStorage.removeItem('profile');
    // }

    toManageAccounts() {
        // this.saveEdited();
        this.$router.push('/setup/accounts');
    }
    toManageNFTs() {
        // this.saveEdited();
        this.$router.push('/setup/nfts');
    }
    toManageGitcoins() {
        this.$router.push('/setup/gitcoins');
    }
    async back() {
        // this.clearEdited();
        this.$gtag.event('cancelEditProfile', { userid: (<IRSS3>this.rss3).account.address });
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
        // this.clearEdited();
        this.$gtag.event('finishEditProfile', { userid: (<IRSS3>this.rss3).account.address });
        this.isLoading = false;
        const redirectFrom = sessionStorage.getItem('redirectFrom');
        sessionStorage.removeItem('redirectFrom');
        await this.$router.push(redirectFrom || '/home');
    }
}
</script>

<style lang="postcss" scoped></style>
