<template>
    <div id="main" class="h-screen text-body-text bg-body-bg overflow-y-auto">
        <div
            v-if="isAccountExist"
            class="grid gap-4 grid-cols-1 m-auto pb-12 pt-8 px-4 max-w-screen-lg select-none md:grid-cols-2"
        >
            <section class="relative md:col-span-2">
                <Profile
                    :avatar="rss3Profile.avatar"
                    :username="rss3Profile.username"
                    :address="ethAddress"
                    :rns="rns"
                    :followers="rss3Relations.followers.length"
                    :followings="rss3Relations.followings.length"
                    :bio="rss3Profile.bio"
                    :website="rss3Profile.link"
                    :is-loading-persona="isLoadingPersona"
                    @click-address="clickAddress"
                >
                    <template #Accounts>
                        <div
                            class="inline-block mr-1 cursor-pointer"
                            v-for="item in accounts"
                            :key="item.platform + item.identity"
                            @click="displayDialog(item.identity, item.platform)"
                        >
                            <EVMpAccountItem v-if="item.platform === 'EVM+'" :size="30" :address="item.identity" />
                            <AccountItem v-else :size="30" :chain="item.platform" :address="item.identity" />
                        </div>
                        <Button
                            v-if="isOwner"
                            size="sm"
                            shape="circle"
                            class="inline-block mr-1 w-8 h-8 text-account-btn-s-text bg-account-btn-s shadow-account"
                            @click="toManageAccounts"
                        >
                            <i class="bx bxs-pencil bx-xs" />
                        </Button>
                        <Button
                            size="sm"
                            shape="circle"
                            class="inline-block mr-1 w-8 h-8 text-account-btn-s-text bg-account-btn-s shadow-account"
                            @click="toAccountsPage"
                        >
                            <i class="bx bx-expand-alt bx-xs" />
                        </Button>
                    </template>

                    <template #Toolbar>
                        <Toolbar
                            :isOwner="isOwner"
                            :isFollowing="isFollowing"
                            :is-loading-persona="isLoadingPersona"
                            @to-setup-page="toSetupPage"
                            @logout="logout"
                            @action="action"
                        />
                    </template>
                </Profile>
            </section>

            <BarCard color="nft">
                <template #header>
                    <NFTIcon />
                </template>
                <template #content>
                    <NFTItem
                        class="mr-1 cursor-pointer"
                        v-for="item in nfts"
                        :key="item.platform + item.identity + item.id"
                        :image-url="item.info.animation_url || item.info.image_preview_url"
                        :poster-url="item.info.image_preview_url"
                        :size="40"
                        @click="toSingleItemPage('NFT', item.platform, item.identity, item.id, item.type)"
                    />
                </template>
                <template #footer>
                    <section class="flex flex-row gap-2">
                        <Button
                            v-if="isOwner"
                            size="sm"
                            class="w-8 h-8 text-nft-btn-s-text bg-nft-btn-s shadow-nft-btn-s"
                            @click="toManageNFTs"
                        >
                            <i class="bx bxs-pencil bx-xs" />
                        </Button>
                        <Button
                            size="sm"
                            class="w-8 h-8 text-nft-btn-s-text bg-nft-btn-s shadow-nft-btn-s"
                            @click="toListPage('NFT')"
                        >
                            <i class="bx bx-expand-alt bx-xs" />
                        </Button>
                    </section>
                </template>
            </BarCard>

            <BarCard color="gitcoin">
                <template #header>
                    <GitcoinIcon :iconColor="currentTheme === 'loot' ? 'white' : 'black'" />
                </template>
                <template #content>
                    <GitcoinItem
                        class="mr-1 cursor-pointer"
                        v-for="item in gitcoins"
                        :key="item.platform + item.identity + item.id"
                        :size="40"
                        :imageUrl="item.info.image_preview_url || defaultAvatar"
                        @click="toSingleItemPage('Gitcoin', item.platform, item.identity, item.id, item.type)"
                    />
                </template>
                <template #footer>
                    <section class="flex flex-row gap-2">
                        <Button
                            v-if="isOwner"
                            size="sm"
                            class="w-8 h-8 text-gitcoin-btn-s-text bg-gitcoin-btn-s shadow-gitcoin-btn-s"
                            @click="toManageGitcoins"
                        >
                            <i class="bx bxs-pencil bx-xs" />
                        </Button>
                        <Button
                            size="sm"
                            class="w-8 h-8 text-gitcoin-btn-s-text bg-gitcoin-btn-s shadow-gitcoin-btn-s"
                            @click="toListPage('Gitcoin')"
                        >
                            <i class="bx bx-expand-alt bx-xs" />
                        </Button>
                    </section>
                </template>
            </BarCard>

            <Card
                title="Footprints"
                color-title="text-footprint-title"
                color-tips="text-footprint-title"
                color-background="bg-footprint-bg"
                class="w-full border-footprint-border"
                :is-having-content="true"
                :is-single-line="false"
                id="footprint-card"
            >
                <template #title-icon><FootprintIcon /> </template>

                <template #header-button>
                    <section class="flex flex-row gap-2">
                        <Button
                            v-if="isOwner"
                            size="sm"
                            class="w-8 h-8 text-footprint-btn-s-text bg-footprint-btn-s shadow-footprint-btn-s"
                            @click="toManageFootprints"
                        >
                            <i class="bx bxs-pencil bx-xs" />
                        </Button>
                        <Button
                            v-if="!isPCLayout"
                            size="sm"
                            class="w-8 h-8 text-footprint-btn-s-text bg-footprint-btn-s shadow-footprint-btn-s"
                            @click="toListPage('Footprint')"
                        >
                            <i class="bx bx-expand-alt bx-xs" />
                        </Button>
                    </section>
                </template>
                <template #content>
                    <div
                        v-if="isPCLayout"
                        class="scrollbar-hide flex flex-col px-0.5 overflow-y-auto"
                        :class="{
                            'h-72': isPCLayout,
                            'justify-center': footprints.length === 0,
                        }"
                    >
                        <div v-if="footprints.length > 0" class="divide-footprint-divider divide-y-xs">
                            <!-- FootprintCard example -->
                            <FootprintCard
                                v-for="item of footprints"
                                :key="item.platform + item.identity + item.id"
                                :imageUrl="item.info.image_preview_url"
                                :username="rss3Profile.username"
                                :activity="item.info.title"
                                :start-date="item.info.start_date"
                                :end-date="item.info.end_date"
                                :location="item.info.city || item.info.country || 'Metaverse'"
                                :special="item.identity === 'Special'"
                                @claim="claimSpecialPOAP"
                                :class="{
                                    'cursor-pointer': item.identity !== 'Special',
                                }"
                                @click="toSingleItemPage('Footprint', item.platform, item.identity, item.id, item.type)"
                            />
                        </div>
                        <div v-else>
                            <div class="m-auto mt-4 text-center text-footprint-title">
                                {{ isLoadingAssets.Footprint ? 'Loading...' : "Haven't found anything yet..." }}
                            </div>
                        </div>
                    </div>
                    <div
                        v-else-if="footprints.length > 0"
                        class="flex flex-col px-0.5 divide-footprint-divider divide-y-xs"
                    >
                        <div>
                            <FootprintCard
                                :imageUrl="footprints[0].info.image_preview_url"
                                :username="rss3Profile.username"
                                :activity="footprints[0].info.title"
                                :start-date="footprints[0].info.start_date"
                                :end-date="footprints[0].info.end_date"
                                :location="footprints[0].info.city || footprints[0].info.country || 'Metaverse'"
                                :special="footprints[0].identity === 'Special'"
                                @claim="claimSpecialPOAP"
                                :class="{
                                    'cursor-pointer': footprints[0].identity !== 'Special',
                                }"
                                @click="
                                    toSingleItemPage(
                                        'Footprint',
                                        footprints[0].platform,
                                        footprints[0].identity,
                                        footprints[0].id,
                                        footprints[0].type,
                                    )
                                "
                            />
                        </div>
                        <div class="inline-flex p-4 overflow-x-auto" style="scrollbar-width: thin">
                            <FootprintItem
                                v-for="item of footprints.slice(1)"
                                :key="item.platform + item.identity + item.id"
                                :imageUrl="item.info.image_preview_url"
                                :size="78"
                                class="flex-shrink-0 mr-2"
                                @click="toSingleItemPage('Footprint', item.platform, item.identity, item.id, item.type)"
                            />
                        </div>
                    </div>
                    <div v-else>
                        <div class="m-auto mt-4 text-center text-footprint-title">
                            {{ isLoadingAssets.Footprint ? 'Loading...' : "Haven't found anything yet..." }}
                        </div>
                    </div>
                </template>
            </Card>

            <Card
                title="Content"
                color-title="text-content-title"
                color-tips="text-content-title"
                color-background="bg-content-bg"
                class="w-auto border-content-border md:col-start-2 md:row-span-3 md:row-start-2"
                :isSingleLine="false"
                :is-having-content="true"
            >
                <template #title-icon><ContentIcon /></template>
                <template #content>
                    <div
                        class="scrollbar-hide flex flex-col px-0.5 overflow-y-auto md:h-112"
                        :class="{
                            'h-112': isPCLayout,
                            'justify-center': contents.length === 0,
                        }"
                    >
                        <div v-if="contents.length > 0" class="divide-content-divider divide-y-xs">
                            <div v-for="item in contents" :key="item.id">
                                <ContentCard
                                    :timestamp="parseInt(item.info.timestamp)"
                                    :content="item.info.pre_content"
                                    :title="item.info.title"
                                    :provider="item.type"
                                    @click="toContentLink(item.info.link)"
                                />
                            </div>
                            <div>
                                <Button
                                    size="sm"
                                    class="w-full h-6 text-content-btn-s-text bg-content-btn-s shadow-content-btn-s"
                                    v-show="isContentsHaveMore"
                                    @click="loadMoreContents"
                                    id="contents-load-more-button"
                                >
                                    <i v-if="isLoadingContents" class="bx bx-loader-circle bx-spin"></i>
                                    <i v-else class="bx bx-dots-horizontal-rounded" />
                                </Button>
                            </div>
                        </div>
                        <div v-else class="mt-4 text-center text-content-title">
                            {{ isLoadingContents ? 'Loading...' : "Haven't found anything yet..." }}
                        </div>
                    </div>
                </template>
            </Card>

            <div class="center fixed bottom-0 left-0 mt-2 w-full">
                <div
                    class="
                        flex flex-row
                        gap-x-2
                        items-center
                        justify-between
                        m-auto
                        px-4
                        py-2
                        max-w-screen-lg
                        bg-footer-bg
                    "
                >
                    <Logo class="cursor-pointer" :size="18" @click="toHomePage" />
                    <div class="text-right text-body-text text-xs font-normal">
                        <a href="https://rss3.io/#/privacy"> Privacy </a>
                        |
                        <span>
                            Made with 🌀 by
                            <a
                                href="https://rss3.io"
                                class="
                                    text-body-text
                                    no-underline
                                    visited:no-underline
                                    active:no-underline
                                    text-xs
                                    font-normal
                                "
                                >RSS3</a
                            >
                        </span>
                    </div>
                </div>
            </div>

            <Modal v-show="isShowingAccount">
                <template #header>
                    <Button
                        size="sm"
                        class="absolute left-4 w-10 h-10 text-secondary-btn-text bg-secondary-btn shadow-secondary-btn"
                        @click="closeDialog"
                    >
                        <i class="bx bx-chevron-left bx-sm"></i>
                    </Button>
                </template>
                <template #body>
                    <div class="flex flex-col gap-y-4 items-center">
                        <EVMpAccountItem
                            class="m-auto mt-4"
                            v-if="showingAccountDetails.platform === 'EVM+'"
                            :size="90"
                            :address="showingAccountDetails.address"
                        />
                        <AccountItem
                            class="m-auto mt-4"
                            v-else
                            :size="90"
                            :chain="showingAccountDetails.platform"
                            :address="showingAccountDetails.address"
                        />
                        <span class="address mt-4 text-center break-all text-xl font-semibold">
                            {{ showingAccountDetails.address }}
                        </span>
                        <Button
                            size="sm"
                            class="
                                text-md
                                m-auto
                                mt-4
                                w-1/4
                                text-account-btn-m-text
                                bg-account-btn-m
                                shadow-account-btn-m
                            "
                            @click="
                                showingAccountDetails.isLink
                                    ? toExternalLink(showingAccountDetails.link)
                                    : copyToClipboard(showingAccountDetails.address)
                            "
                        >
                            {{ showingAccountDetails.isLink ? 'Go' : 'Copy' }}
                        </Button>
                    </div>
                </template>
            </Modal>

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
                            class="w-72 text-primary-btn-text bg-primary-btn shadow-primary-btn"
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
            class="onboarding flex items-center justify-center h-full text-center bg-pass3gradient bg-cover bg-fixed"
        >
            <div class="body flex flex-col items-center justify-between justify-center px-4 h-2/3">
                <Logo :size="200" />
                <div class="max-w-md text-primary-text text-2xl">
                    <p>This account is not on RSS3 yet...</p>
                </div>
                <div class="mx-auto w-83.5 text-2xl leading-17.5">
                    <Button
                        size="lg"
                        class="mb-9 w-full h-17.5 text-primary-btn-text bg-primary-btn rounded-3xl shadow-primary-btn"
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
import BarCard from '@/components/BarCard.vue';
import Profile from '@/components/Profile.vue';
import AccountItem from '@/components/AccountItem.vue';
import NFTItem from '@/components/NFT/NFTItem.vue';
import RSS3, { IRSS3 } from '@/common/rss3';
import { RSS3Account, RSS3Asset, RSS3ID, RSS3Index } from 'rss3-next/types/rss3';
import Modal from '@/components/Modal.vue';
import RNSUtils from '@/common/rns';
import config from '@/config';
import GitcoinItem from '@/components/GitcoinItem.vue';
import { GeneralAsset, GeneralAssetWithTags } from '@/common/types';

import NFTIcon from '@/components/Icons/NFTIcon.vue';
import GitcoinIcon from '@/components/Icons/GitcoinIcon.vue';
import ContentIcon from '@/components/Icons/ContentIcon.vue';
import FootprintIcon from '@/components/Icons/FootprintIcon.vue';
import Logo from '@/components/Logo.vue';

import FootprintCard from '@/components/FootprintCard.vue';
import ContentCard from '@/components/ContentCard.vue';
import { debounce } from 'lodash';
import ContentProviders, { Content } from '@/common/content-providers';
import Toolbar from '@/components/Toolbar.vue';
import FootprintItem from '@/components/FootprintItem.vue';
import EVMpAccountItem from '@/components/EVMpAccountItem.vue';

import activities from '@/common/poap-activity';

interface ProfileInfo {
    avatar: string;
    username: string;
    address: string;
    bio: string;
    link: string;
}

interface Relations {
    followers: RSS3ID[];
    followings: RSS3ID[];
}

@Options({
    name: 'Home',
    components: {
        EVMpAccountItem,
        FootprintItem,
        Button,
        BarCard,
        Card,
        Profile,
        AccountItem,
        NFTItem,
        Modal,
        GitcoinItem,
        NFTIcon,
        ContentIcon,
        GitcoinIcon,
        FootprintCard,
        ContentCard,
        Logo,
        Toolbar,
        FootprintIcon,
    },
})
export default class Home extends Vue {
    rns: string = '';
    ethAddress: string = '';
    rss3?: IRSS3;
    isFollowing: boolean = false;
    isOwner: boolean = false;
    isShowingAccount: boolean = false;
    showingAccountDetails: {
        address: string;
        platform: string;
        isLink: boolean;
        link?: string;
    } = {
        address: '',
        platform: 'Ethereum',
        isLink: false,
    };
    isAccountExist: boolean = true;
    isLoadingAssets: {
        NFT: boolean;
        Gitcoin: boolean;
        Footprint: boolean;
    } = {
        NFT: true,
        Gitcoin: true,
        Footprint: true,
    };
    loadingAssetsIntervalID: ReturnType<typeof setInterval> | null = null;
    isLoadingContents: boolean = true;
    currentTheme: string = '';
    isLoadingPersona: boolean = true;

    rss3Profile: ProfileInfo = {
        avatar: config.defaultAvatar,
        username: '...',
        address: '',
        bio: '...',
        link: '',
    };
    rss3Relations: Relations = {
        followers: [],
        followings: [],
    };
    accounts: RSS3Account[] = [];
    nfts: GeneralAssetWithTags[] = [];
    gitcoins: GeneralAssetWithTags[] = [];
    footprints: GeneralAssetWithTags[] = [];
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
    isPCLayout: boolean = false;
    isOwnerValidRSS3: boolean = false;
    ownerETHAddress: string = '';
    isContentsHaveMoreEachProvider: {
        provider: RSS3Account;
        more: boolean;
        lastTS: number;
    }[] = [
        {
            provider: {
                platform: 'RSS3',
                identity: 'Hub',
                signature: '',
            },
            more: true,
            lastTS: 0xffffffff,
        },
    ];

    async mounted() {
        this.isPCLayout = window.innerWidth >= 768;
        window.onresize = () => {
            return (() => {
                this.isPCLayout = window.innerWidth >= 768;
            })();
        };
        this.mountScrollEvent();
    }

    async initLoad() {
        this.lastRoute = this.$route.fullPath;
        this.isShowingAccount = false;
        this.showingAccountDetails = {
            address: '',
            platform: 'Ethereum',
            isLink: false,
        };
        this.isLoadingPersona = true;
        (<HTMLLinkElement>document.getElementById('favicon')).href = '/favicon.ico';
        document.title = 'Web3 Pass';

        this.isOwnerValidRSS3 = await RSS3.reconnect();
        this.rss3 = await RSS3.visitor();
        const owner: string = <string>this.rss3.account.address;
        this.ownerETHAddress = owner;
        if (!(await this.getAddress(owner))) {
            if (this.isAccountExist) {
                if (this.isOwnerValidRSS3) {
                    this.rns = await RNSUtils.addr2Name(owner);
                    this.ethAddress = owner;
                    this.isOwner = true;
                    if (this.rns && config.subDomain.rootDomain) {
                        window.location.href = '//' + this.rns + '.' + config.subDomain.rootDomain;
                    }
                } else {
                    this.isOwner = false;
                    sessionStorage.setItem('redirectFrom', this.$route.fullPath);
                    this.ethAddress = '';
                    if (config.subDomain.isSubDomainMode) {
                        window.location.href = '//' + config.subDomain.rootDomain;
                    } else {
                        await this.$router.push('/');
                    }
                    return;
                }
            } else {
                return;
            }
        }

        // Split time-consuming methods from main thread, so it won't stuck the page loading progress
        setTimeout(async () => {
            const profile = await (<IRSS3>this.rss3).profile.get(this.ethAddress);
            await this.checkIsFollowing();

            this.rss3Profile.avatar = profile?.avatar?.[0] || config.defaultAvatar;
            this.rss3Profile.username = profile?.name || '';

            if (profile?.bio) {
                const fieldPattern = /<([A-Z]+?)#(.+?)>/gi;
                const fields = profile.bio.match(fieldPattern) || [];
                this.rss3Profile.bio = profile.bio.replace(fieldPattern, '');

                for (const field of fields) {
                    const splits = fieldPattern.exec(field) || [];
                    switch (splits[1]) {
                        case 'SITE':
                            this.rss3Profile.link = splits[2];
                            break;
                        default:
                            // Do nothing
                            break;
                    }
                }
            } else {
                this.rss3Profile.bio = '';
            }

            this.rss3Profile.address = this.ethAddress;

            this.isLoadingPersona = false;
        }, 0);

        const accounts = await (<IRSS3>this.rss3).accounts.get(this.ethAddress);
        this.startLoadingAccounts(accounts);

        setTimeout(async () => {
            this.rss3Relations.followers = (await (<IRSS3>this.rss3).backlinks.get(this.ethAddress, 'following')) || [];
            this.rss3Relations.followings =
                (await (<IRSS3>this.rss3).links.get(this.ethAddress, 'following'))?.list || [];
        }, 0);

        // Load assets
        await this.startLoadingAssets(true);

        // Load Contents
        setTimeout(async () => {
            await this.initLoadContents(accounts);
            this.initIntersectionObserver();
        }, 0);
    }

    async getAddress(owner: string) {
        console.log('Is subdomain mode:', config.subDomain.isSubDomainMode);

        let address: string = '';
        if (config.subDomain.isSubDomainMode) {
            // Is subdomain mode
            address = window.location.host.split('.')[0];
        } else if (this.$route.params.address) {
            address = <string>this.$route.params.address;
        } else {
            return false;
        }

        if (address) {
            if (address.startsWith('0x')) {
                // Might be address type
                // Get RNS and redirect
                this.ethAddress = address;
                this.rns = await RNSUtils.addr2Name(address);
                if (this.rns !== '') {
                    window.location.href = '//' + this.rns + '.' + config.subDomain.rootDomain;
                }
            } else {
                // RNS
                this.rns = address;
                this.ethAddress = (await RNSUtils.name2Addr(address)).toString();
                if (parseInt(this.ethAddress) === 0) {
                    this.isAccountExist = false;
                    return false;
                }
            }

            const file = <RSS3Index>await (<IRSS3>this.rss3).files.get(this.ethAddress);

            if (!file.signature) {
                this.isAccountExist = false;
            }

            this.isOwner = this.ethAddress === owner;
        }

        return true;
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

    startLoadingAccounts(accounts: RSS3Account[]) {
        this.accounts = [];
        setTimeout(async () => {
            // Push original account
            this.accounts.push({
                platform: 'Ethereum',
                identity: this.ethAddress,
                signature: '',
                tags: ['pass:order:-1'],
            });

            await this.loadAccounts(accounts);
        }, 0);
    }

    async ivLoadNFT(refresh: boolean): Promise<boolean> {
        const data = await RSS3.getAssetProfile(this.ethAddress, 'NFT', refresh);
        if (data && data.status !== false) {
            await this.mergeAssets(
                await (<IRSS3>this.rss3).assets.get(this.ethAddress),
                <GeneralAsset[]>data.assets,
                'NFT',
            );
            this.isLoadingAssets.NFT = false;
            return true;
        }
        return false;
    }

    async ivLoadGitcoin(refresh: boolean): Promise<boolean> {
        const data = await RSS3.getAssetProfile(this.ethAddress, 'Gitcoin-Donation', refresh);
        if (data && data.status !== false) {
            await this.mergeAssets(
                await (<IRSS3>this.rss3).assets.get(this.ethAddress),
                <GeneralAsset[]>data.assets,
                'Gitcoin-Donation',
            );
            this.isLoadingAssets.Gitcoin = false;
            return true;
        }
        return false;
    }

    async ivLoadFootprint(refresh: boolean): Promise<boolean> {
        const data = await RSS3.getAssetProfile(this.ethAddress, 'POAP', refresh);
        if (data && data.status !== false) {
            await this.mergeAssets(
                await (<IRSS3>this.rss3).assets.get(this.ethAddress),
                <GeneralAsset[]>data.assets,
                'POAP',
            );
            this.isLoadingAssets.Footprint = false;
            return true;
        }
        return false;
    }

    async ivLoadAsset(refresh: boolean): Promise<boolean> {
        let isFinish = true;
        if (this.isLoadingAssets.NFT) {
            isFinish = (await this.ivLoadNFT(refresh)) && isFinish;
        }
        if (this.isLoadingAssets.Gitcoin) {
            isFinish = (await this.ivLoadGitcoin(refresh)) && isFinish;
        }
        if (this.isLoadingAssets.Footprint) {
            isFinish = (await this.ivLoadFootprint(refresh)) && isFinish;
        }
        if (isFinish) {
            if (this.loadingAssetsIntervalID) {
                clearInterval(this.loadingAssetsIntervalID);
                this.loadingAssetsIntervalID = null;
            }
        }
        return isFinish;
    }

    async startLoadingAssets(refresh: boolean) {
        if (refresh) {
            this.isLoadingAssets = {
                NFT: true,
                Gitcoin: true,
                Footprint: true,
            };
        }
        if (!(await this.ivLoadAsset(refresh))) {
            this.loadingAssetsIntervalID = setInterval(async () => {
                await this.ivLoadAsset(refresh);
            }, 2000);
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

    async mergeAssets(assetsInRSS3File: RSS3Asset[], assetsGrabbed: GeneralAsset[], type: string) {
        const assetsMerge: GeneralAssetWithTags[] = await Promise.all(
            (assetsGrabbed || []).map(async (ag: GeneralAssetWithTags) => {
                const origType = ag.type;
                if (config.hideUnlistedAsstes) {
                    ag.type = 'Invalid'; // Using as a match mark
                }
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

        const List: GeneralAssetWithTags[] = [];

        for (const am of assetsMerge) {
            if (am.type.includes(type)) {
                List.push(am);
            } // else Invalid
        }

        const res = List.filter((asset) => !asset.tags || asset.tags.indexOf('pass:hidden') === -1).sort(
            (a, b) => this.getAssetOrder(a) - this.getAssetOrder(b),
        );

        if (type.includes('NFT')) {
            this.nfts = res;
        } else if (type === 'Gitcoin-Donation') {
            this.gitcoins = res;
        } else if (type === 'POAP') {
            // Check special footprint
            await this.checkSpecialPoap(res);

            this.footprints = res;
        }
    }

    async checkSpecialPoap(res: GeneralAssetWithTags[]) {
        if (config.poapActivity.info.title && this.isOwner) {
            if (res.findIndex((asset) => asset.info.title === config.poapActivity.info.title) === -1) {
                res.unshift({
                    platform: 'EVM+',
                    type: 'xDai-POAP',
                    identity: 'Special', // Impossible value for 'Special' identification
                    id: 'active', // status (active / pending)
                    info: config.poapActivity.info,
                });
            }
        }
    }

    async initLoadContents(accounts: RSS3Account[]) {
        await this.loadMoreContents(true);
    }

    async loadMoreContents(isInitLoad: boolean = false) {
        if ((!isInitLoad && this.isLoadingContents) || !this.isContentsHaveMore) {
            // Is already loading or not having more
            return;
        }
        this.isLoadingContents = true;
        let isHavingMore: boolean = false;
        const contentsMerge: Content[] = [];
        for (const provider of this.isContentsHaveMoreEachProvider) {
            if (provider.provider.platform === 'RSS3' && provider.provider.identity === 'Hub') {
                if (provider.more) {
                    const contents: Content[] = await ContentProviders[provider.provider.identity].get(
                        this.ethAddress,
                        provider.lastTS,
                    );
                    if (contents.length < config.contentRequestLimit) {
                        // No more
                        provider.more = false;
                    } else {
                        isHavingMore = true;
                    }

                    for (const content of contents) {
                        // temp. fix mirror undefined error
                        if (content?.info?.link?.includes('//undefined.mirror.xyz/')) {
                            content.info.link = `https://mirror.xyz/${content.identity}/${content.info.link
                                .split('/')
                                .pop()}`;
                        }

                        if (
                            content.accessible !== false &&
                            // Opt-out edited mirror contents
                            (content.type !== 'Mirror-XYZ' ||
                                (content.type === 'Mirror-XYZ' &&
                                    contentsMerge.findIndex((ctx) => ctx.info.title === content.info.title) === -1))
                        ) {
                            contentsMerge.push(content);
                        }

                        if (provider.lastTS >= content.info.timestamp) {
                            provider.lastTS = content.info.timestamp - 1;
                        }
                    }
                }
            }
        }

        if (!isHavingMore) {
            this.isContentsHaveMore = false;
        }

        contentsMerge.sort((a, b) => {
            return b.info.timestamp - a.info.timestamp;
        });

        this.contents.push(...contentsMerge);

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

    async action() {
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
            // Clear last user status
            (<HTMLLinkElement>document.getElementById('favicon')).href = '/favicon.ico';
            document.title = 'Web3 Pass';

            sessionStorage.setItem('redirectFrom', this.$route.fullPath);
            if (config.subDomain.isSubDomainMode) {
                window.location.href = '//' + config.subDomain.rootDomain;
            } else {
                await this.$router.push('/');
            }
        }
    }

    async checkIsFollowing() {
        if (!this.ethAddress) {
            this.ethAddress = (await RNSUtils.name2Addr(this.rns)).toString();
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
        if (this.isLoadingAssets.NFT) {
            this.notice = 'NFTs still loading... Maybe check back later?';
            this.isShowingNotice = true;
        } else {
            this.$router.push('/setup/nfts');
        }
    }
    toManageGitcoins() {
        if (this.isLoadingAssets.Gitcoin) {
            this.notice = 'Gitcoins still loading... Maybe check back later?';
            this.isShowingNotice = true;
        } else {
            this.$router.push('/setup/gitcoins');
        }
    }
    toManageFootprints() {
        if (this.isLoadingAssets.Footprint) {
            this.notice = 'Footprints still loading... Maybe check back later?';
            this.isShowingNotice = true;
        } else {
            this.$router.push('/setup/footprints');
        }
    }

    toAccountsPage() {
        this.$gtag.event('visitAccountsPage', { userid: this.rns || this.ethAddress });
        this.$router.push((config.subDomain.isSubDomainMode ? '' : `/${this.rns || this.ethAddress}`) + `/accounts`);
    }

    toListPage(type: string) {
        this.$gtag.event(`visit${type}Page`, { userid: this.rns || this.ethAddress });
        this.$router.push(
            (config.subDomain.isSubDomainMode ? '' : `/${this.rns || this.ethAddress}`) + `/${type.toLowerCase()}s`,
        );
    }

    toSingleItemPage(type: string, platform: string, identity: string, id: string, fullType: string) {
        if (identity !== 'Special') {
            // Default
            this.$gtag.event(`visitSingle${type}`, {
                userid: this.rns || this.ethAddress,
                platform,
                identity,
                id,
                type,
            });
            this.$router.push(
                (config.subDomain.isSubDomainMode ? '' : `/${this.rns || this.ethAddress}`) +
                    `/single${type.toLowerCase()}/${platform}/${identity}/${id}/${fullType}`,
            );
        }
    }

    async claimSpecialPOAP() {
        // Special POAPs: Check status && give notice
        switch (this.footprints[0].id) {
            case 'active':
                this.footprints[0].id = 'pending';
                const res = await activities.mint(this.ethAddress);
                if (res?.errno) {
                    switch (res.errno) {
                        case 1403:
                            this.notice = 'Invalid address. This should be a Internal Server Error.';
                            break;
                        case 1404:
                            this.notice = 'This address is not on RSS3 currently.';
                            break;
                        case 1405:
                            this.notice = 'Sorry, but the limited chances ran out.';
                            break;
                        default:
                            break;
                    }
                } else {
                    if (res?.data?.tx_hash) {
                        this.notice = 'You have already submit the request. Please be patient.';
                    } else {
                        this.notice = 'Your special footprint is on the way~ Come back later!';
                    }
                }
                this.isShowingNotice = true;
                break;
            case 'pending':
                this.notice = 'You have already submit the request. Please be patient.';
                this.isShowingNotice = true;
                break;
            default:
                break;
        }
    }

    toSetupPage() {
        this.$gtag.event('visitSetupPage', { userid: this.rns || this.ethAddress });
        this.$router.push(`/profile`);
    }

    toSetupRNS() {
        this.$gtag.event('visitSetupRNS', { userid: this.rns || this.ethAddress });
        this.$router.push('/rns');
    }

    async toHomePage() {
        if (!this.isOwner && this.isOwnerValidRSS3) {
            const ownerRNS = await RNSUtils.addr2Name(this.ownerETHAddress);
            if (ownerRNS) {
                window.location.href = '//' + ownerRNS + '.' + config.subDomain.rootDomain;
            } else {
                await this.$router.push(`/${this.ownerETHAddress}`);
            }
        } else {
            window.location.href = '//' + config.subDomain.rootDomain;
        }
    }

    toContentLink(link: string) {
        window.open(link);
    }

    displayDialog(address: string, platform: string) {
        if (ContentProviders[platform]) {
            this.showingAccountDetails = {
                address:
                    (ContentProviders[platform].prefix || '') + address + (ContentProviders[platform].suffix || ''),
                platform,
                isLink: true,
                link: ContentProviders[platform].getAccountLink(address),
            };
        } else {
            this.showingAccountDetails = {
                address,
                platform,
                isLink: false,
            };
        }

        this.isShowingAccount = true;
    }

    closeDialog() {
        this.isShowingAccount = false;
    }

    copyToClipboard(address: string) {
        navigator.clipboard.writeText(address).then(
            function () {
                console.log('Async: Copying to clipboard was successful!');
            },
            function (err) {
                console.error('Async: Could not copy the account: ', err);
            },
        );
    }

    toExternalLink(link: string) {
        window.open(link);
    }

    clickAddress() {
        navigator.clipboard.writeText(
            this.rns
                ? `https://${this.rns}.${config.subDomain.rootDomain}`
                : `https://${config.subDomain.rootDomain}/${this.ethAddress}`,
        );
    }

    toMakeDonation() {
        window.open('https://gitcoin.co/');
    }

    async logout() {
        if (confirm('Are you sure to logout?')) {
            (<HTMLLinkElement>document.getElementById('favicon')).href = '/favicon.ico';
            document.title = 'Web3 Pass';

            await RSS3.disconnect();
            if (config.subDomain.isSubDomainMode) {
                window.location.href = '//' + config.subDomain.rootDomain;
            } else {
                await this.$router.push('/');
            }
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
            // if (this.isLoadingAssets.NFT || this.isLoadingAssets.Gitcoin || this.isOwner) {
            //     this.startLoadingAccounts(await (<IRSS3>this.rss3).accounts.get(this.ethAddress));
            //     await this.startLoadingAssets(false);
            // }
            await this.initLoad(); // TODO temporary measure
        } else {
            this.contents = [];
            this.isFollowing = false;
            this.isOwner = false;
            this.isLoadingContents = true;
            this.rss3Profile = {
                avatar: config.defaultAvatar,
                username: '...',
                address: '',
                bio: '...',
                link: '',
            };
            this.isContentsHaveMore = true;
            this.isContentsHaveMoreEachProvider = [
                {
                    provider: {
                        platform: 'RSS3',
                        identity: 'Hub',
                        signature: '',
                    },
                    more: true,
                    lastTS: 0xffffffff,
                },
            ];
            this.nfts = [];
            this.gitcoins = [];
            this.footprints = [];

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
