<template>
    <div id="main" class="h-screen bg-body-bg overflow-y-auto text-body-text">
        <div v-if="isAccountExist" class="px-4 pt-8 pb-12 flex flex-col gap-y-2 max-w-md m-auto select-none">
            <Profile
                :avatar="rss3Profile.avatar"
                :username="rss3Profile.username"
                :address="ethAddress"
                :rns="rns"
                :followers="rss3Relations.followers"
                :followings="rss3Relations.followings"
                :bio="rss3Profile.bio"
                @click-address="clickAddress"
                click-address-notice="Copied!"
            />
            <Button
                size="sm"
                class="w-auto text-lg mb-4 duration-200"
                v-if="!isOwner"
                v-bind:class="[
                    isFollowing
                        ? 'bg-secondary-btn text-secondary-btn-text shadow-secondary-btn'
                        : 'bg-primary-btn text-primary-btn-text shadow-primary-btn',
                ]"
                @click="action()"
            >
                <span>{{ isFollowing ? 'Following' : 'Follow' }}</span>
                <i class="bx bx-sm no-underline" v-bind:class="[isFollowing ? 'bx-check' : 'bx-plus']"></i>
            </Button>

            <div class="flex mb-4 h-13 gap-2 mt-2" v-else>
                <Button
                    size="lg"
                    class="text-lg bg-secondary-btn text-secondary-btn-text shadow-secondary-btn flex-1"
                    @click="toSetupPage"
                >
                    <span>Edit Profile</span>
                    <i class="bx bx-pencil bx-sm"></i>
                </Button>
                <Button
                    size="lg"
                    class="w-13 text-lg bg-primary-btn text-primary-btn-text shadow-primary-btn"
                    @click="logout"
                >
                    <i class="bx bx-log-out bx-sm"></i>
                </Button>
            </div>

            <AccountCard>
                <template #header-button>
                    <div v-if="isOwner" class="flex flex-row gap-2">
                        <Button
                            size="sm"
                            class="w-8 h-8 bg-account-btn-s text-account-btn-s-text shadow-account-btn-s"
                            @click="toManageAccounts"
                        >
                            <i class="bx bxs-pencil bx-xs" />
                        </Button>
                        <Button
                            size="sm"
                            class="w-8 h-8 bg-account-btn-s text-account-btn-s-text shadow-account-btn-s"
                            @click="toAccountsPage"
                        >
                            <i class="bx bx-expand-alt bx-xs" />
                        </Button>
                    </div>
                    <Button
                        v-else
                        size="sm"
                        class="w-10 h-10 bg-account-btn-s text-account-btn-s-text shadow-account-btn-s"
                        @click="toAccountsPage"
                    >
                        <i class="bx bx-expand-alt bx-xs"></i>
                    </Button>
                </template>
                <template #content>
                    <AccountItem
                        class="inline-block mr-1 cursor-pointer"
                        :size="40"
                        :chain="item.platform"
                        v-for="item in accounts"
                        :key="item.platform + item.identity"
                        @click="displayDialog(item.identity, item.platform)"
                    />
                </template>
            </AccountCard>

            <Card
                title="NFTs"
                color-title="text-nft-title"
                color-tips="text-nft-title"
                color-background="bg-nft-bg"
                class="w-full border-nft-border"
                :is-having-content="nfts.length !== 0"
                :is-single-line="nfts.length !== 0"
                :tips="isLoadingAssets ? 'Loading...' : nfts.length === 0 ? 'Haven\'t found anything yet...' : ''"
                id="nfts-card"
            >
                <template #title-icon><NFTIcon /></template>

                <template #header-button>
                    <div v-if="isOwner" class="flex flex-row gap-2">
                        <Button
                            size="sm"
                            class="w-8 h-8 bg-nft-btn-s text-nft-btn-s-text shadow-nft-btn-s"
                            @click="toManageNFTs"
                        >
                            <i class="bx bxs-pencil bx-xs" />
                        </Button>
                        <Button
                            size="sm"
                            class="w-8 h-8 bg-nft-btn-s text-nft-btn-s-text shadow-nft-btn-s"
                            @click="toNFTsPage"
                        >
                            <i class="bx bx-expand-alt bx-xs" />
                        </Button>
                    </div>
                    <Button
                        v-else
                        size="sm"
                        class="w-10 h-10 bg-nft-btn-s text-nft-btn-s-text shadow-nft-btn-s"
                        @click="toNFTsPage"
                    >
                        <i class="bx bx-expand-alt bx-xs" />
                    </Button>
                </template>
                <template #content>
                    <NFTItem
                        class="inline-flex mx-0.5 cursor-pointer"
                        v-for="item in nfts"
                        :key="item.platform + item.identity + item.id"
                        :image-url="item.info.animation_url || item.info.image_preview_url"
                        :poster-url="item.info.image_preview_url"
                        :size="70"
                        @click="toSingleNFTPage(item.platform, item.identity, item.id)"
                    />
                </template>
            </Card>

            <Card
                title="Donations"
                color-title="text-gitcoin-title"
                color-tips="text-gitcoin-title"
                color-background="bg-gitcoin-bg"
                class="w-full border-gitcoin-border"
                :is-having-content="true"
                :is-single-line="gitcoins.length !== 0"
                id="gitcoins-card"
            >
                <template #title-icon>
                    <GitcoinIcon :iconColor="currentTheme === 'loot' ? 'white' : 'black'" />
                </template>

                <template #header-button>
                    <div v-if="isOwner" class="flex flex-row gap-2">
                        <Button
                            size="sm"
                            class="w-8 h-8 bg-gitcoin-btn-s text-gitcoin-btn-s-text shadow-gitcoin-btn-s"
                            @click="toManageGitcoins"
                        >
                            <i class="bx bxs-pencil bx-xs" />
                        </Button>
                        <Button
                            size="sm"
                            class="w-8 h-8 bg-gitcoin-btn-s text-gitcoin-btn-s-text shadow-gitcoin-btn-s"
                            @click="toGitcoinsPage"
                        >
                            <i class="bx bx-expand-alt bx-xs" />
                        </Button>
                    </div>
                    <Button
                        v-else
                        size="sm"
                        class="w-10 h-10 bg-gitcoin-btn-s text-gitcoin-btn-s-text shadow-gitcoin-btn-s"
                        @click="toGitcoinsPage"
                    >
                        <i class="bx bx-expand-alt bx-xs"></i>
                    </Button>
                </template>
                <template #content>
                    <template v-if="gitcoins.length !== 0">
                        <GitcoinItem
                            class="inline-flex mx-0.5 cursor-pointer"
                            v-for="item in gitcoins"
                            :key="item.platform + item.identity + item.id"
                            :size="70"
                            :imageUrl="item.info.image_preview_url || defaultAvatar"
                            @click="toSingleGitcoin(item.platform, item.identity, item.id)"
                        />
                    </template>
                    <div v-else-if="isLoadingAssets" class="text-gitcoin-title m-auto text-center mt-4">Loading...</div>
                    <div v-else-if="!isOwner" class="text-gitcoin-title m-auto text-center mt-4">
                        Haven't found anything yet...
                    </div>
                    <div v-else class="flex justify-center">
                        <Button
                            size="lg"
                            class="
                                text-lg
                                bg-gitcoin-btn-m
                                text-gitcoin-btn-m-text
                                shadow-gitcoin-btn-m
                                cursor-pointer
                                m-auto
                                mt-4
                            "
                            @click="toMakeDonation"
                        >
                            <span>Make your first donation!</span>
                        </Button>
                    </div>
                </template>
            </Card>

            <Card
                title="Contents"
                color-title="text-content-title"
                color-tips="text-content-title"
                color-background="bg-content-bg"
                class="w-auto border-content-border"
                :is-having-content="true"
            >
                <template #title-icon><ContentIcon /></template>
                <template #content>
                    <div class="flex flex-col overflow-y-auto" v-if="contents.length !== 0">
                        <ContentCard
                            class="mb-4"
                            v-for="item in contents"
                            :key="item.id"
                            :timestamp="parseInt(item.info.timestamp)"
                            :content="item.info.pre_content"
                            :title="item.info.title"
                            :provider="item.type"
                            @click="toContentLink(item.info.link)"
                        />

                        <Button
                            size="sm"
                            class="w-full h-6 bg-content-btn-s text-content-btn-s-text shadow-content-btn-s"
                            v-show="isContentsHaveMore"
                            @click="loadMoreContents"
                            id="contents-load-more-button"
                        >
                            <i v-if="isLoadingContents" class="bx bx-loader-circle bx-spin"></i>
                            <i v-else class="bx bx-dots-horizontal-rounded" />
                        </Button>
                    </div>
                    <div v-else-if="isLoadingContents" class="text-content-title m-auto text-center mt-4">
                        Loading...
                    </div>
                    <div v-else class="text-content-title m-auto text-center mt-4">Haven't found anything yet...</div>
                </template>
            </Card>

            <div class="mt-2 fixed bottom-0 left-0 w-full center">
                <div class="px-4 py-2 max-w-md m-auto flex justify-between items-center bg-footer-bg">
                    <Logo class="cursor-pointer" :size="18" @click="toHomePage" />
                    <div class="text-body-text font-normal text-xs text-right">
                        Made with 🌀 by
                        <a
                            href="https://rss3.io"
                            class="
                                text-body-text
                                font-normal
                                text-xs
                                no-underline
                                visited:no-underline
                                active:no-underline
                            "
                            >RSS3</a
                        >
                    </div>
                </div>
            </div>

            <Modal v-show="isdisplaying">
                <template #header>
                    <Button
                        size="sm"
                        class="absolute left-4 w-10 h-10 bg-secondary-btn text-secondary-btn-text shadow-secondary-btn"
                        @click="closeDialog"
                    >
                        <i class="bx bx-chevron-left bx-sm"></i>
                    </Button>
                </template>
                <template #body>
                    <div class="flex flex-col gap-y-4 items-center">
                        <AccountItem class="m-auto mt-4" :size="90" :chain="dialogChain"></AccountItem>
                        <span class="address text-xl font-semibold break-all text-center mt-4">
                            {{ dialogAddress }}
                        </span>
                        <Button
                            size="sm"
                            class="text-md bg-account-btn-m text-account-btn-m-text shadow-account-btn-m m-auto mt-4"
                            @click="copyToClipboard(dialogAddress)"
                        >
                            Copy
                        </Button>
                    </div>
                </template>
            </Modal>

            <!-- Share Card -->
            <div
                v-show="isShowingShareCard"
                class="fixed w-screen h-screen m-0 p-0 top-0 left-0 flex justify-center items-center flex-col"
            >
                <div class="fixed w-screen h-screen bg-share-bg bg-opacity-70" @click="isShowingShareCard = false" />

                <ShareCard
                    class="max-w-md"
                    :name="rss3Profile.username"
                    :avatar="rss3Profile.avatar"
                    :address="`${rns}`"
                    ref="shareCard"
                    :id="`share-card-${rns}`"
                />

                <div class="flex flex-row gap-7">
                    <Button
                        size="sm"
                        class="w-12 h-12 bg-primary text-white shadow-primary mt-8"
                        @click="saveShareCard"
                    >
                        <i class="bx bx-download bx-sm" />
                    </Button>
                    <Button
                        size="sm"
                        class="w-12 h-12 bg-primary text-white shadow-primary mt-8"
                        @click="shareShareCard"
                    >
                        <i class="bx bx-share-alt bx-sm" />
                    </Button>
                </div>
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
                            class="w-72 bg-primary-btn text-primary-btn-text shadow-primary-btn"
                            @click="isShowingNotice = false"
                        >
                            OK
                        </Button>
                    </div>
                </template>
            </Modal>
        </div>
        <div
            v-else
            class="onboarding h-full text-center bg-cover bg-fixed flex items-center justify-center bg-pass3gradient"
        >
            <div class="body px-4 h-2/3 flex flex-col justify-center items-center justify-between">
                <Logo :size="200" />
                <div class="text-primary-text text-2xl max-w-md">
                    <p>This account is not on RSS3 yet...</p>
                </div>
                <div class="leading-17.5 w-83.5 text-2xl mx-auto">
                    <Button
                        size="lg"
                        class="bg-primary-btn shadow-primary-btn text-primary-btn-text rounded-3xl w-full h-17.5 mb-9"
                        @click="toHomePage"
                    >
                        <span> Go Home </span>
                    </Button>
                </div>
            </div>
        </div>
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
import { RSS3Account, RSS3Asset, RSS3ID, RSS3Index } from 'rss3-next/types/rss3';
import Modal from '@/components/Modal.vue';
import RNSUtils from '@/common/rns';
import config from '@/config';
import AccountCard from '@/components/AccountCard.vue';
import GitcoinItem from '@/components/GitcoinItem.vue';
import { GeneralAsset, GeneralAssetWithTags } from '@/common/types';
import ShareCard from '@/components/ShareCard.vue';
import html2canvas from '@/common/html2canvas.js';
import NFTIcon from '@/components/Icons/NFTIcon.vue';
import GitcoinIcon from '@/components/Icons/GitcoinIcon.vue';
import ContentIcon from '@/components/Icons/ContentIcon.vue';
import Logo from '@/components/Logo.vue';
import ContentCard from '@/components/ContentCard.vue';
import { debounce } from 'lodash';
import ContentProviders, { Content } from '@/common/content-providers';
import LinkButton from '@/components/LinkButton.vue';

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
    name: 'Home',
    components: {
        LinkButton,
        Button,
        Card,
        Profile,
        AccountItem,
        NFTItem,
        Modal,
        AccountCard,
        GitcoinItem,
        ShareCard,
        NFTIcon,
        ContentIcon,
        GitcoinIcon,
        ContentCard,
        Logo,
    },
})
export default class Home extends Vue {
    rns: string = '';
    ethAddress: string = '';
    rss3?: IRSS3;
    isFollowing: boolean = false;
    isOwner: boolean = false;
    isdisplaying: boolean = false;
    dialogAddress: string = '';
    dialogChain: string = '';
    isAccountExist: boolean = true;
    isShowingShareCard: boolean = false;
    isLoadingAssets: boolean = true;
    loadingAssetsIntervalID: ReturnType<typeof setInterval> | null = null;
    isLoadingContents: boolean = false;
    currentTheme: string = '';

    rss3Profile: ProfileInfo = {
        avatar: config.defaultAvatar,
        username: '...',
        address: '',
        bio: '...',
    };
    rss3Relations: Relations = {
        followers: [],
        followings: [],
    };
    accounts: RSS3Account[] = [];
    nfts: GeneralAssetWithTags[] = [];
    gitcoins: GeneralAssetWithTags[] = [];
    contents: Content[] = [];
    $gtag: any;
    scrollTop: number = 0;
    scrollNftsLeft: number = 0;
    scrollGitcoinsLeft: number = 0;
    lastRoute: string = '';
    defaultAvatar = config.defaultAvatar;
    notice: string = '';
    isShowingNotice: boolean = false;
    isContentsHaveMore: boolean = true;

    async mounted() {
        this.mountScrollEvent();
    }

    async initLoad() {
        this.lastRoute = this.$route.fullPath;
        this.contents = [];
        this.isFollowing = false;
        this.isOwner = false;
        this.isdisplaying = false;
        this.dialogAddress = '';
        this.dialogChain = '';
        this.isShowingShareCard = false;
        this.isLoadingAssets = true;
        this.isLoadingContents = false;
        this.rss3Profile = {
            avatar: config.defaultAvatar,
            username: '...',
            address: '',
            bio: '...',
        };
        this.isContentsHaveMore = true;
        (<HTMLLinkElement>document.getElementById('favicon')).href = '/favicon.ico';
        document.title = 'Web3 Pass';

        const isValidRSS3 = await RSS3.reconnect();
        this.rss3 = await RSS3.visitor();
        const owner: string = <string>this.rss3.account.address;
        let address: string = <string>this.rss3.account.address;
        if (this.$route.params.address) {
            address = <string>this.$route.params.address;
            if (address.startsWith('0x')) {
                // Might be address type
                // Get RNS and redirect
                this.ethAddress = address;
                this.rns = (await RNSUtils.addr2Name(address)).replace(config.rns.suffix, '');
                if (this.rns !== '') {
                    await this.$router.push(`/${this.rns}`);
                } else if (this.ethAddress === owner) {
                    this.isOwner = true;
                }
            } else {
                // RNS
                this.rns = address;
                this.ethAddress = (await RNSUtils.name2Addr(address + config.rns.suffix)).toString();
                if (parseInt(this.ethAddress) !== 0) {
                    this.isOwner = this.ethAddress === owner;
                } else {
                    this.isAccountExist = false;
                    return;
                }
            }

            const file = <RSS3Index>await this.rss3.files.get(this.ethAddress);

            if (!file.signature) {
                this.isAccountExist = false;
                return;
            }
        } else {
            if (!isValidRSS3) {
                sessionStorage.setItem('redirectFrom', this.$route.fullPath);
                this.ethAddress = '';
                await this.$router.push('/');
                return;
            } else {
                this.rns = (await RNSUtils.addr2Name(owner)).replace(config.rns.suffix, '');
                this.ethAddress = owner;
                this.isOwner = true;
            }
        }

        // Split time-consuming methods from main thread, so it won't stuck the page loading progress
        setTimeout(async () => {
            const profile = await (<IRSS3>this.rss3).profile.get(this.ethAddress);
            await this.checkIsFollowing();

            this.rss3Profile.avatar = profile?.avatar?.[0] || config.defaultAvatar;
            this.rss3Profile.username = profile?.name || '';
            this.rss3Profile.bio = profile?.bio || '';
            this.rss3Profile.address = this.ethAddress;
        }, 0);

        this.startLoadingAccounts();

        setTimeout(async () => {
            this.rss3Relations.followers = (await (<IRSS3>this.rss3).backlinks.get(this.ethAddress, 'following')) || [];
            this.rss3Relations.followings =
                (await (<IRSS3>this.rss3).links.get(this.ethAddress, 'following'))?.list || [];
        }, 0);

        // Load assets
        this.startLoadingAssets();

        // Load contents
        setTimeout(async () => {
            await this.loadLatestContents();
            this.initIntersectionObserver();
        }, 0);
    }

    async setupTheme() {
        if (this.ethAddress) {
            // Setup theme
            const themes = RSS3.getAvailableThemes(await (<IRSS3>this.rss3).assets.get(this.ethAddress));
            if (themes[0]) {
                this.currentTheme = themes[0].name;
                document.body.classList.add(themes[0].class);
            } else {
                document.body.classList.remove(...document.body.classList);
            }
        } else {
            document.body.classList.remove(...document.body.classList);
        }
    }

    async setPageTitleFavicon() {
        if (this.ethAddress) {
            const rss3 = await RSS3.visitor();
            const profile = await rss3.profile.get(this.ethAddress);
            const favicon = <HTMLLinkElement>document.getElementById('favicon');
            favicon.href = profile?.avatar?.[0] || '/favicon.ico';
            document.title = profile?.name || 'Web3 Pass';
        }
    }

    startLoadingAccounts() {
        this.accounts = [];
        setTimeout(async () => {
            // Push original account
            this.accounts.push({
                platform: 'Ethereum',
                identity: this.ethAddress,
                signature: '',
                tags: ['pass:order:-1'],
            });

            await this.loadAccounts(await (<IRSS3>this.rss3).accounts.get(this.ethAddress));
        }, 0);
    }

    startLoadingAssets() {
        this.nfts = [];
        this.gitcoins = [];
        this.loadingAssetsIntervalID = setInterval(async () => {
            const data = await RSS3.getAssetProfile(this.ethAddress, true);
            if (data && data.status !== false) {
                await this.mergeAssets(
                    await (<IRSS3>this.rss3).assets.get(this.ethAddress),
                    <GeneralAsset[]>data.assets,
                );
                this.isLoadingAssets = false;
                if (this.loadingAssetsIntervalID) {
                    clearInterval(this.loadingAssetsIntervalID);
                    this.loadingAssetsIntervalID = null;
                }
            }
        }, 2000);
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

    async mergeAssets(assetsInRSS3File: RSS3Asset[], assetsGrabbed: GeneralAsset[]) {
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

    async loadLatestContents() {
        await this.loadMoreContents();
    }

    async loadMoreContents() {
        if (this.isLoadingContents || !this.isContentsHaveMore) {
            // Is already loading or not having more
            return;
        }
        this.isLoadingContents = true;
        // Get oldest timestamp
        const nowTS = this.contents.length ? this.contents[this.contents.length - 1].info.timestamp - 1 : 0xffffffff;
        const contents = await ContentProviders.mirror.get(this.ethAddress, 0, nowTS);
        if (contents.length < config.contentRequestLimit) {
            // No more
            this.isContentsHaveMore = false;
        }
        for (const content of contents) {
            if (
                content.accessible !== false &&
                this.contents.findIndex((ctx) => ctx.info.title === content.info.title) === -1 // todo: opt-out this
            ) {
                this.contents.push(content);
            }
        }
        this.isLoadingContents = false;
    }

    initIntersectionObserver() {
        // Check if running in browser
        const runningOnBrowser = typeof window !== 'undefined';
        // Match spiders
        const isBot =
            (runningOnBrowser && !('onscroll' in window)) ||
            (typeof navigator !== 'undefined' &&
                /(gle|ing|ro|msn)bot|crawl|spider|yand|duckgo/i.test(navigator.userAgent));
        // Check if browser supports IntersectionObserver API
        const supportsIntersectionObserver = runningOnBrowser && 'IntersectionObserver' in window;

        const loadMoreButton = document.getElementById('contents-load-more-button');
        if (runningOnBrowser && !isBot && supportsIntersectionObserver && loadMoreButton) {
            const observer = new IntersectionObserver(
                async (entries) => {
                    if (entries[0].isIntersecting) {
                        await this.loadMoreContents();
                        if (!this.isContentsHaveMore) {
                            observer.disconnect();
                        }
                    }
                },
                { threshold: 0 },
            );
            observer.observe(loadMoreButton);
        }
    }

    public async action() {
        if (RSS3.isValidRSS3()) {
            if (this.isFollowing) {
                await this.unfollow();
                this.rss3Relations.followers.splice(
                    this.rss3Relations.followers.indexOf((<IRSS3>this.rss3).account.address),
                    1,
                );
            } else {
                await this.follow();
                this.rss3Relations.followers.push((<IRSS3>this.rss3).account.address);
            }
            const followers = this.$router.getRoutes().find((r) => r.name === 'Followers')?.instances?.default;
            if (followers) {
                (<any>followers).lastRoute = '';
            }
            await (<IRSS3>this.rss3).files.sync();
        } else {
            sessionStorage.setItem('redirectFrom', this.$route.fullPath);
            await this.$router.push('/');
        }
    }

    public async checkIsFollowing() {
        if (!this.ethAddress) {
            this.ethAddress = (await RNSUtils.name2Addr(this.rns + config.rns.suffix)).toString();
        }
        const followList = await this.rss3?.links.get(this.rss3.account.address, 'following');
        if (typeof followList === 'undefined') {
            // No following list. Not following
            this.isFollowing = false;
            return false;
        } else if (followList.list?.includes(this.ethAddress)) {
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
            await rss3?.link.post('following', this.ethAddress);
        }
        this.isFollowing = true;
    }

    async unfollow() {
        const rss3 = await RSS3.get();
        if (await this.checkIsFollowing()) {
            this.$gtag.event('unfollowFriend', { userid: this.rss3Profile['address'] });
            await rss3?.link.delete('following', this.ethAddress);
        }
        this.isFollowing = false;
    }

    toManageAccounts() {
        this.$router.push('/setup/accounts');
    }
    toManageNFTs() {
        // this.saveEdited();
        if (this.isLoadingAssets) {
            this.notice = 'NFTs still loading... Maybe check back later?';
            this.isShowingNotice = true;
        } else {
            this.$router.push('/setup/nfts');
        }
    }
    toManageGitcoins() {
        if (this.isLoadingAssets) {
            this.notice = 'Gitcoins still loading... Maybe check back later?';
            this.isShowingNotice = true;
        } else {
            this.$router.push('/setup/gitcoins');
        }
    }

    public toAccountsPage() {
        this.$gtag.event('visitAccountsPage', { userid: this.rns || this.ethAddress });
        this.$router.push(`/${this.rns || this.ethAddress}/accounts`);
    }

    public toNFTsPage() {
        this.$gtag.event('visitNftPage', { userid: this.rns || this.ethAddress });
        this.$router.push(`/${this.rns || this.ethAddress}/nfts`);
    }

    public toGitcoinsPage() {
        this.$gtag.event('visitGitcoinPage', { userid: this.rns || this.ethAddress });
        this.$router.push(`/${this.rns || this.ethAddress}/gitcoins`);
    }

    public toSetupPage() {
        this.$gtag.event('visitSetupPage', { userid: this.rns || this.ethAddress });
        this.$router.push(`/profile`);
    }

    toSetupRNS() {
        this.$gtag.event('visitSetupRNS', { userid: this.rns || this.ethAddress });
        this.$router.push('/rns');
    }

    async toHomePage() {
        if (this.$route.fullPath !== '/home') {
            await this.$router.push('/home');
            this.isAccountExist = true;
            await this.initLoad();
        } else {
            // To top
        }
    }

    public toSingleNFTPage(platform: string, identity: string, id: string) {
        this.$gtag.event('visitSingleNft', {
            userid: this.rns || this.ethAddress,
            platform: platform,
            nftidentity: identity,
            nftid: id,
        });
        this.$router.push(`/${this.rns || this.ethAddress}/singlenft/${platform}/${identity}/${id}`);
    }

    public toSingleGitcoin(platform: string, identity: string, id: string) {
        this.$gtag.event('visitSingleGitcoin', {
            userid: this.rns || this.ethAddress,
            platform: platform,
            identity: identity,
            id: id,
        });
        this.$router.push(`/${this.rns || this.ethAddress}/singlegitcoin/${platform}/${identity}/${id}`);
    }

    toContentLink(link: string) {
        window.open(link);
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

    clickAddress() {
        navigator.clipboard.writeText(`https://pass3.me/${this.rns || this.ethAddress}`);
    }

    showShareCard() {
        this.isShowingShareCard = true;
    }

    async saveShareCard() {
        const shareCard = document.getElementById(`share-card-${this.rns}`);
        if (shareCard) {
            const canvas = await html2canvas(shareCard, {
                useCORS: true,
                logging: false,
                scale: 3,
            });
            const link = document.createElement('a');
            link.download = `${this.rns}.png`;
            link.href = canvas.toDataURL();
            link.click();
        }
    }

    async shareShareCard() {
        if (navigator.share) {
            await navigator.share({
                title: this.rss3Profile.username,
                text: this.rss3Profile.bio,
                url: `https://pass3.me/${this.rns}`, // Todo: Change to one's own RNS after SSR done
            });
        }
    }

    toMakeDonation() {
        window.open('https://gitcoin.co/');
    }

    async logout() {
        if (confirm('Are you sure to logout?')) {
            (<HTMLLinkElement>document.getElementById('favicon')).href = '/favicon.ico';
            document.title = 'Web3 Pass';

            await RSS3.disconnect();
            await this.$router.push('/');
            this.lastRoute = '';
        }
    }

    mountScrollEvent() {
        const el = document.getElementById('main');
        if (el) {
            el.addEventListener(
                'scroll',
                debounce((ev) => {
                    this.scrollTop = el.scrollTop;
                }, 100),
            );
        }
        const nfts = document.getElementById('nfts-card')?.getElementsByClassName('card-content')?.[0];
        if (nfts) {
            nfts.addEventListener(
                'scroll',
                debounce((ev) => {
                    this.scrollNftsLeft = nfts.scrollLeft;
                }, 100),
            );
        }
        const gitcoins = document.getElementById('gitcoins-card')?.getElementsByClassName('card-content')?.[0];
        if (gitcoins) {
            gitcoins.addEventListener(
                'scroll',
                debounce((ev) => {
                    this.scrollGitcoinsLeft = gitcoins.scrollLeft;
                }, 100),
            );
        }
    }

    async activated() {
        if (this.lastRoute === this.$route.fullPath) {
            // Recover scroll position
            const el = document.getElementById('main');
            const nfts = document.getElementById('nfts-card')?.getElementsByClassName('card-content')?.[0];
            const gitcoins = document.getElementById('gitcoins-card')?.getElementsByClassName('card-content')?.[0];
            if (el) {
                el.scrollTop = this.scrollTop;
            }
            if (nfts) {
                nfts.scrollLeft = this.scrollNftsLeft;
            }
            if (gitcoins) {
                gitcoins.scrollLeft = this.scrollGitcoinsLeft;
            }

            // Reload
            if (this.isLoadingAssets || this.isOwner) {
                this.startLoadingAccounts();
                this.startLoadingAssets();
            }
        } else {
            await this.initLoad();
        }
        await this.setPageTitleFavicon();
        await this.setupTheme();
    }

    async deactivated() {
        if (this.loadingAssetsIntervalID) {
            clearInterval(this.loadingAssetsIntervalID);
            this.loadingAssetsIntervalID = null;
        }
    }
}
</script>

<style></style>
