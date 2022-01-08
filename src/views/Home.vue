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
                    :website="rss3Profile.displayAddress"
                    :is-loading-persona="isLoadingPersona"
                    @click-address="clickAddress"
                >
                    <template #Accounts>
                        <div
                            class="inline-block mr-1 cursor-pointer"
                            v-for="item in accounts"
                            :key="item.identity"
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
                            @toggleFollow="toggleFollow"
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
                        :key="item.id"
                        :image-url="item.detail.animation_url || item.detail.image_preview_url || defaultAvatar"
                        :poster-url="
                            item.detail.image_preview_url ||
                            item.detail.image_url ||
                            item.detail.animation_url ||
                            item.detail.animation_original_url ||
                            defaultAvatar
                        "
                        size="sm"
                        @click="toSingleItemPage(item.id)"
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
                        :key="item.id"
                        size="sm"
                        :imageUrl="item.detail.grant.logo || defaultAvatar"
                        @click="toSingleItemPage(item.id)"
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
                            <FootprintCard
                                v-for="item of footprints"
                                :key="item.id"
                                :imageUrl="item.detail.image_url || defaultAvatar"
                                :username="rss3Profile.username"
                                :activity="item.detail.name"
                                :start-date="item.detail.start_date"
                                :end-date="item.detail.end_date"
                                :location="item.detail.city || item.detail.country || 'Metaverse'"
                                class="cursor-pointer"
                                @click="toSingleItemPage(item.id)"
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
                                :imageUrl="footprints[0].detail.image_url"
                                :username="rss3Profile.username"
                                :activity="footprints[0].detail.name"
                                :start-date="footprints[0].detail.start_date"
                                :end-date="footprints[0].detail.end_date"
                                :location="footprints[0].detail.city || footprints[0].detail.country || 'Metaverse'"
                                class="cursor-pointer"
                                @click="toSingleItemPage(footprints[0].id)"
                            />
                        </div>
                        <div class="inline-flex p-4 overflow-x-auto" style="scrollbar-width: thin">
                            <FootprintItem
                                v-for="item of footprints.slice(1)"
                                :key="item.id"
                                :imageUrl="item.detail.image_url"
                                size="sm"
                                class="flex-shrink-0 mr-2 cursor-pointer"
                                @click="toSingleItemPage(item.id)"
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
                            <div v-for="element in contents" :key="element.id">
                                <ContentCard
                                    :timestamp="new Date(element.date_updated).valueOf()"
                                    :content="element.summary"
                                    :title="element.title"
                                    :provider="
                                        element.target.field.includes('Mirror.XYZ')
                                            ? 'Mirror-XYZ'
                                            : element.target.field.split('-')[2]
                                    "
                                    @click="toContentLink(element)"
                                />
                            </div>
                            <IntersectionObserverContainer
                                :once="false"
                                :enabled="!isLoadingContents"
                                @trigger="loadMoreContents"
                            >
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
                            </IntersectionObserverContainer>
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
import Button from '@/components/Button/Button.vue';
import Card from '@/components/Card/Card.vue';
import BarCard from '@/components/Card/BarCard.vue';
import Profile from '@/components/Profile/Profile.vue';
import AccountItem from '@/components/Account/AccountItem.vue';
import NFTItem from '@/components/NFT/NFTItem.vue';
import RSS3, { IRSS3 } from '@/common/rss3';
import { utils as RSS3Utils } from 'rss3';
import Modal from '@/components/Common/Modal.vue';
import RNSUtils from '@/common/rns';
import utils from '@/common/utils';
import legacyConfig from '@/config';
import GitcoinItem from '@/components/Donation/GitcoinItem.vue';
import { Profile as ProfileInfo, GeneralAsset } from '@/common/types';

import NFTIcon from '@/components/Icons/NFTIcon.vue';
import GitcoinIcon from '@/components/Icons/GitcoinIcon.vue';
import ContentIcon from '@/components/Icons/ContentIcon.vue';
import FootprintIcon from '@/components/Icons/FootprintIcon.vue';
import Logo from '@/components/Icons/Logo.vue';

import FootprintCard from '@/components/Footprint/FootprintCard.vue';
import ContentCard from '@/components/Content/ContentCard.vue';
import { debounce, uniqBy } from 'lodash';
import ContentProviders from '@/common/content-providers';
import Toolbar from '@/components/Profile/Toolbar.vue';
import FootprintItem from '@/components/Footprint/FootprintItem.vue';
import EVMpAccountItem from '@/components/Account/EVMpAccountItem.vue';
import { AnyObject } from 'rss3/types/extend';
import IntersectionObserverContainer from '@/components/Common/IntersectionObserverContainer.vue';

interface Relations {
    followers: string[];
    followings: string[];
}

@Options({
    name: 'Home',
    components: {
        IntersectionObserverContainer,
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
        platform: 'EVM+',
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
    isContentsHaveMore: boolean = true;
    isLoadingMore: boolean = false;
    currentTheme: string = '';
    isLoadingPersona: boolean = true;

    rss3Profile: ProfileInfo = {
        avatar: legacyConfig.defaultAvatar,
        username: '...',
        address: '',
        bio: '...',
        displayAddress: '',
    };
    rss3Relations: Relations = {
        followers: [],
        followings: [],
    };
    accounts: AnyObject[] = [];
    nfts: AnyObject[] = [];
    gitcoins: AnyObject[] = [];
    footprints: AnyObject[] = [];
    contents: any[] = [];
    contentTimestamp: string = '';
    $gtag: any;
    scrollTop: number = 0;
    scrollNftsLeft: number = 0;
    scrollGitcoinsLeft: number = 0;
    lastRoute: string = '';
    defaultAvatar = legacyConfig.defaultAvatar;
    notice: string = '';
    isShowingNotice: boolean = false;

    isPCLayout: boolean = false;
    isOwnerValidRSS3: boolean = false;
    ownerETHAddress: string = '';

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

        (<HTMLLinkElement>document.getElementById('favicon')).href = '/favicon.ico';
        document.title = 'Web3 Pass';

        this.isLoadingPersona = true;
        const aon = utils.getAddress(<string>this.$route.params.address);
        console.log(aon);
        const pageOwner = await RSS3.setPageOwner(aon);
        this.isShowingAccount = false;

        this.rns = pageOwner.name;
        this.ethAddress = pageOwner.address;

        utils.subDomainModeRedirect(this.rns);

        if (pageOwner.file?.signature) {
            this.isAccountExist = true;
        } else {
            this.isAccountExist = false;
            return;
        }

        await this.updateUserInfo();

        if (RSS3.isValidRSS3()) {
            await RSS3.ensureLoginUser();
            this.checkIsFollowing();
            this.isOwner = RSS3.isNowOwner();
        }
    }

    async updateUserInfo() {
        const pageOwner = RSS3.getPageOwner();

        const profile = pageOwner.profile;

        this.rss3Profile.avatar = profile?.avatar?.[0] || legacyConfig.defaultAvatar;
        this.rss3Profile.username = profile?.name || '';
        this.rss3Profile.address = this.ethAddress;
        if (profile?.bio) {
            // Profile
            const { extracted, fieldsMatch } = utils.extractEmbedFields(profile?.bio || '', ['SITE']);
            this.rss3Profile.bio = extracted;
            this.rss3Profile.displayAddress = fieldsMatch?.['SITE'] || '';
        } else {
            this.rss3Profile.bio = '';
        }

        this.startLoadingAccounts();

        this.rss3Relations.followers = pageOwner.followers;
        this.rss3Relations.followings = pageOwner.followings;

        this.isLoadingPersona = false;

        // Load assets
        await this.startLoadingAssets(true);

        // Load Contents
        setTimeout(async () => {
            const { listed, haveMore, timestamp } = await utils.initContent();
            while (listed.length > 0) {
                if ('target' in listed[0] && listed[0].target.field.includes('Mirror.XYZ')) {
                    if (this.contents.findIndex((item) => 'target' in item && item.title === listed[0].title) === -1) {
                        this.contents.push(listed[0]);
                    }
                } else {
                    this.contents.push(listed[0]);
                }
                listed.shift();
            }
            this.contentTimestamp = timestamp;
            this.isContentsHaveMore = haveMore;
            this.isLoadingContents = false;
        }, 0);
    }

    startLoadingAccounts() {
        this.accounts = [];
        const pageOwner = RSS3.getPageOwner();
        setTimeout(async () => {
            const { listed } = await utils.initAccounts();
            // Push original account
            const accounts = [
                {
                    id: RSS3Utils.id.getAccount('EVM+', pageOwner?.address),
                },
            ].concat(listed);
            this.accounts = accounts.map((account) => RSS3Utils.id.parseAccount(account.id));
        }, 0);
    }

    async loadAssetDetails(assetList: GeneralAsset[], limit?: number) {
        let assetDetails: AnyObject[] = []; // todo: fix this
        if (limit) {
            const previewList = limit <= assetList.length ? assetList.slice(0, limit) : assetList;
            assetDetails = await utils.loadAssets(previewList);
        } else {
            assetDetails = await utils.loadAssets(assetList);
        }
        return assetDetails;
    }

    async ivLoadNFT(refresh: boolean, assets: GeneralAsset[]): Promise<boolean> {
        if (assets) {
            this.nfts = await this.loadAssetDetails(assets);
            this.isLoadingAssets.NFT = false;
            return true;
        }
        return false;
    }

    async ivLoadGitcoin(refresh: boolean, assets: GeneralAsset[]): Promise<boolean> {
        if (assets) {
            this.gitcoins = await this.loadAssetDetails(assets);
            this.isLoadingAssets.Gitcoin = false;
            return true;
        }
        return false;
    }

    async ivLoadFootprint(refresh: boolean, assets: GeneralAsset[]): Promise<boolean> {
        if (assets) {
            this.footprints = await this.loadAssetDetails(assets);
            this.isLoadingAssets.Footprint = false;
            return true;
        }
        return false;
    }

    async ivLoadAsset(refresh: boolean): Promise<boolean> {
        if (!this.isAccountExist) {
            // Account not exist, prevent loading assets
            return true;
        }
        let isFinish: boolean;
        const allAssets = await utils.initAssets();
        const result = await Promise.all([
            this.ivLoadNFT(refresh, allAssets.nfts),
            this.ivLoadGitcoin(refresh, allAssets.donations),
            this.ivLoadFootprint(refresh, allAssets.footprints),
        ]);
        isFinish = result[0] && result[1] && result[2];
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

    async loadMoreContents() {
        this.isLoadingContents = true;

        if (this.isContentsHaveMore) {
            const { listed, haveMore, timestamp } = await utils.initContent(this.contentTimestamp);
            while (listed.length > 0) {
                if ('target' in listed[0] && listed[0].target.field.includes('Mirror.XYZ')) {
                    if (this.contents.findIndex((item) => 'target' in item && item.title === listed[0].title) === -1) {
                        this.contents.push(listed[0]);
                    }
                } else {
                    this.contents.push(listed[0]);
                }
                listed.shift();
            }
            this.contentTimestamp = timestamp;
            this.isContentsHaveMore = haveMore;
        }

        this.isLoadingContents = false;
    }

    async toggleFollow() {
        if (RSS3.isValidRSS3()) {
            if (this.isFollowing) {
                await this.unfollow();
            } else {
                await this.follow();
            }
            // Trigger force refresh
            const followers = this.$router.getRoutes().find((r) => r.name === 'Followers')?.instances?.default;
            if (followers) {
                (<any>followers).lastRoute = '';
            }
            // Save and sync
            const loginUserPersona = RSS3.getLoginUser().persona as IRSS3;
            await loginUserPersona.files.sync();
        } else {
            // Clear last user status
            (<HTMLLinkElement>document.getElementById('favicon')).href = '/favicon.ico';
            document.title = 'Web3 Pass';

            sessionStorage.setItem('redirectFrom', this.$route.fullPath);
            if (legacyConfig.subDomain.isSubDomainMode) {
                window.location.href = '//' + legacyConfig.subDomain.rootDomain;
            } else {
                await this.$router.push('/');
            }
        }
    }

    checkIsFollowing() {
        const loginUser = RSS3.getLoginUser();
        const pageOwner = RSS3.getPageOwner();
        const followList = loginUser.followings;
        if (followList?.includes(pageOwner.address)) {
            this.isFollowing = true;
            return true;
        } else {
            this.isFollowing = false;
            return false;
        }
    }

    async follow() {
        const loginUser = RSS3.getLoginUser();
        const pageOwner = RSS3.getPageOwner();

        if (!this.checkIsFollowing()) {
            pageOwner.followers.push(loginUser.address);
            loginUser.followings.push(pageOwner.address);
            await loginUser.persona?.links.post('following', pageOwner.address);
        }
        this.isFollowing = true;
    }

    async unfollow() {
        const loginUser = RSS3.getLoginUser();
        const pageOwner = RSS3.getPageOwner();

        if (this.checkIsFollowing()) {
            pageOwner.followers.splice(pageOwner.followers.indexOf(loginUser.address), 1);
            loginUser.followings.splice(loginUser.followings.indexOf(pageOwner.address), 1);
            await loginUser.persona?.links.delete('following', pageOwner.address);
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
        this.$router.push(
            (legacyConfig.subDomain.isSubDomainMode ? '' : `/${this.rns || this.ethAddress}`) + `/accounts`,
        );
    }

    toListPage(type: string) {
        this.$gtag.event(`visit${type}Page`, { userid: this.rns || this.ethAddress });
        this.$router.push(
            (legacyConfig.subDomain.isSubDomainMode ? '' : `/${this.rns || this.ethAddress}`) +
                `/${type.toLowerCase()}s`,
        );
    }

    toSingleItemPage(id: string) {
        const { platform, identity, type, uniqueID } = RSS3Utils.id.parseAsset(id);
        let assetType = '';
        switch (type.split('.')[1]) {
            case 'NFT':
                assetType = 'Nft';
                break;
            case 'Donation':
                assetType = 'Gitcoin';
                break;
            case 'POAP':
                assetType = 'Footprint';
                break;
            default:
                break;
        }
        // Default
        this.$gtag.event(`visitSingle${assetType}`, {
            userid: this.rns || this.ethAddress,
            platform,
            identity,
            uniqueID,
            type,
        });
        this.$router.push(
            (legacyConfig.subDomain.isSubDomainMode ? '' : `/${this.rns || this.ethAddress}`) +
                `/single${assetType.toLowerCase()}/${platform}/${identity}/${uniqueID}/${type}`,
        );
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
                window.location.href = '//' + ownerRNS + '.' + legacyConfig.subDomain.rootDomain;
            } else {
                await this.$router.push(`/${this.ownerETHAddress}`);
            }
        } else {
            window.location.href = '//' + legacyConfig.subDomain.rootDomain;
        }
    }

    toContentLink(content: any) {
        const [type, mode, platform, user] = content.target.field.split('-');
        let link;
        if (platform === 'Twitter') {
            link = `https://twitter.com/${user}/status/${content.target.action.payload}`;
        } else if (platform === 'Misskey') {
            const [username, instance] = user.split('@');
            link = `https://${instance}/notes/${content.target.action.payload}`;
        } else if (platform === 'Jike') {
            link = `https://m.okjike.com/originalPosts/${content.target.action.payload}`;
        } else if (user === 'Mirror.XYZ') {
            link = content.target.action.payload;
        }

        if (link) {
            window.open(link, '_blank');
        }
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
                ? `https://${this.rns}.${legacyConfig.subDomain.rootDomain}`
                : `https://${legacyConfig.subDomain.rootDomain}/${this.ethAddress}`,
        );
    }

    async logout() {
        if (confirm('Are you sure to logout?')) {
            (<HTMLLinkElement>document.getElementById('favicon')).href = '/favicon.ico';
            document.title = 'Web3 Pass';

            await RSS3.disconnect();
            if (legacyConfig.subDomain.isSubDomainMode) {
                window.location.href = '//' + legacyConfig.subDomain.rootDomain;
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
            await this.updateUserInfo();
        } else {
            this.contents = [];
            this.contentTimestamp = '';
            this.isFollowing = false;
            this.isOwner = false;
            this.isLoadingContents = true;
            this.rss3Profile = {
                avatar: legacyConfig.defaultAvatar,
                username: '...',
                address: '',
                bio: '...',
                displayAddress: '',
            };
            this.isContentsHaveMore = true;
            this.nfts = [];
            this.gitcoins = [];
            this.footprints = [];

            await this.initLoad();
        }
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
