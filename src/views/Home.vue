<template>
    <div id="main" class="m-auto max-w-screen-lg px-4 pb-12 pt-8 text-body-text">
        <Header :displayLogo="true" />
        <div class="flex flex-col gap-4 md:flex-row">
            <section class="md:w-3/5">
                <div class="affix-container sticky flex flex-col gap-4">
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
                                class="mr-1 inline-block cursor-pointer"
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
                                class="mr-1 inline-block h-8 w-8 bg-secondary-btn-card text-btn-icon"
                                @click="toManageAccounts"
                            >
                                <i class="bx bx-pencil bx-xs" />
                            </Button>
                            <Button
                                size="sm"
                                shape="circle"
                                class="mr-1 inline-block h-8 w-8 bg-secondary-btn-card text-btn-icon"
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
                                @toggleFollow="toggleFollow"
                            />
                        </template>
                    </Profile>

                    <!-- <TransBarCard title="NFT Score" :haveDetails="true" :haveContent="false">
                        <template #details>
                            <div class="flex flex-row items-center justify-between">
                                <LoadingSmile :size="18" :isLooping="true" v-show="isRankLoading" />
                                <div class="flex flex-row gap-4" v-show="!isRankLoading">
                                    <div class="text-xl font-bold">{{ score }}</div>
                                    <div class="rounded-full bg-secondary-btn px-4"># {{ rank }}</div>
                                </div>
                                <div class="flex flex-row gap-2">
                                    <Button
                                        size="sm"
                                        class="h-8 w-8 bg-secondary-btn-card text-btn-icon"
                                        @click="openShareCard"
                                    >
                                        <i class="bx bx-share bx-flip-horizontal" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        class="h-8 w-8 bg-secondary-btn-card text-btn-icon"
                                        @click="toLeaderboard()"
                                    >
                                        <i class="bx bx-expand-alt bx-xs" />
                                    </Button>
                                </div>
                            </div>
                        </template>
                    </TransBarCard> -->

                    <template v-for="className in allClasses" :key="className">
                        <TransBarCard
                            v-if="className === 'Collectibles'"
                            :title="className"
                            :tip="isLoadingNFT ? 'loading' : isOwner ? 'ownerEmpty' : 'notOwnerEmpty'"
                            :haveDetails="false"
                            :haveContent="true"
                            :haveContentInfo="classifiedList[className].length > 0"
                        >
                            <template #header>
                                <i
                                    v-if="isOwner"
                                    class="bx bx-pencil bx-xs relative cursor-pointer"
                                    @click="toManageNFTs(className)"
                                >
                                    <span
                                        class="absolute -right-1.5 -top-1.5 inline-flex h-2 w-2 rounded-full bg-red-500"
                                    />
                                </i>
                            </template>
                            <template #content>
                                <NFTItem
                                    class="mr-1 cursor-pointer"
                                    v-for="item in classifiedList[className]"
                                    :key="item.id"
                                    :image-url="
                                        item.detail.image_preview_url || item.detail.animation_url || undefinedImage
                                    "
                                    :poster-url="
                                        item.detail.image_preview_url ||
                                        item.detail.image_url ||
                                        item.detail.animation_url ||
                                        item.detail.animation_original_url ||
                                        undefinedImage
                                    "
                                    size="md"
                                    @click="toSingleItemPage(item.id)"
                                />
                            </template>
                            <template #button>
                                <Button
                                    size="sm"
                                    class="h-8 w-8 bg-secondary-btn-card text-btn-icon"
                                    @click="toListPage(`nfts/${className}`)"
                                >
                                    <i class="bx bx-expand-alt bx-xs" />
                                </Button>
                            </template>
                        </TransBarCard>

                        <TransBarCard
                            v-else
                            :title="className"
                            :tip="isLoadingNFT ? 'loading' : isOwner ? 'ownerEmpty' : 'notOwnerEmpty'"
                            :haveDetails="classifiedList[className].length > 0"
                            :haveContent="true"
                            :haveContentInfo="classifiedList[className].length > 0"
                        >
                            <template #header>
                                <i
                                    v-if="isOwner"
                                    class="bx bx-pencil bx-xs cursor-pointer"
                                    @click="toManageNFTs(className)"
                                />
                            </template>
                            <template #details>
                                <AssetCard
                                    v-for="item in classifiedList[className].slice(0, 3)"
                                    :key="item.id"
                                    :image-url="
                                        item.detail.image_preview_url || item.detail.animation_url || undefinedImage
                                    "
                                    size="sm"
                                    :type="className"
                                    :name="item.detail.name"
                                    :username="rss3Profile.username"
                                    @click="toSingleItemPage(item.id)"
                                />
                            </template>
                            <template #content>
                                <NFTItem
                                    class="mr-1 cursor-pointer"
                                    v-for="item in classifiedList[className].slice(3)"
                                    :key="item.id"
                                    :image-url="
                                        item.detail.image_preview_url || item.detail.animation_url || undefinedImage
                                    "
                                    :poster-url="
                                        item.detail.image_preview_url ||
                                        item.detail.image_url ||
                                        item.detail.animation_url ||
                                        item.detail.animation_original_url ||
                                        undefinedImage
                                    "
                                    size="sm"
                                    @click="toSingleItemPage(item.id)"
                                />
                            </template>
                            <template #button>
                                <Button
                                    size="sm"
                                    class="h-8 w-8 bg-secondary-btn-card text-btn-icon"
                                    @click="toListPage(`nfts/${className}`)"
                                >
                                    <i class="bx bx-expand-alt bx-xs" />
                                </Button>
                            </template>
                        </TransBarCard>
                    </template>

                    <TransBarCard
                        title="Footprints"
                        :tip="isLoadingFootprint ? 'loading' : isOwner ? 'ownerEmpty' : 'notOwnerEmpty'"
                        :haveDetails="footprints.length !== 0"
                        :haveContent="true"
                        :haveContentInfo="footprints.length > 0"
                    >
                        <template #header>
                            <i v-if="isOwner" class="bx bx-pencil bx-xs cursor-pointer" @click="toManageFootprints" />
                        </template>
                        <template #details>
                            <FootprintCard
                                v-if="footprints.length > 0"
                                :imageUrl="footprints[0].detail.image_url"
                                :username="rss3Profile.username"
                                :activity="footprints[0].detail.name"
                                :start-date="footprints[0].detail.start_date"
                                :end-date="footprints[0].detail.end_date"
                                :location="footprints[0].detail.city || footprints[0].detail.country || 'Metaverse'"
                                type="brief"
                                @click="toSingleItemPage(footprints[0].id)"
                            />
                        </template>
                        <template #content>
                            <FootprintItem
                                v-for="item of footprints.slice(1)"
                                :key="item.id"
                                :imageUrl="item.detail.image_url"
                                size="sm"
                                class="mr-2 shrink-0 cursor-pointer"
                                @click="toSingleItemPage(item.id)"
                            />
                        </template>
                        <template #button>
                            <Button
                                size="sm"
                                class="h-8 w-8 bg-secondary-btn-card text-btn-icon"
                                @click="toListPage('Footprints')"
                            >
                                <i class="bx bx-expand-alt bx-xs" />
                            </Button>
                        </template>
                    </TransBarCard>

                    <TransBarCard
                        title="Donations"
                        :tip="isLoadingDonation ? 'loading' : isOwner ? 'ownerEmpty' : 'notOwnerEmpty'"
                        :haveDetails="false"
                        :haveContent="true"
                        :haveContentInfo="gitcoins.length > 0"
                    >
                        <template #header>
                            <i v-if="isOwner" class="bx bx-pencil bx-xs cursor-pointer" @click="toManageGitcoins" />
                        </template>
                        <template #content>
                            <GitcoinItem
                                class="mr-1 cursor-pointer"
                                v-for="item in gitcoins"
                                :key="item.id"
                                size="sm"
                                :imageUrl="item.detail.grant.logo || undefinedImage"
                                @click="toSingleItemPage(item.id)"
                            />
                        </template>
                        <template #button>
                            <Button
                                size="sm"
                                class="h-8 w-8 bg-secondary-btn-card text-btn-icon"
                                @click="toListPage('Gitcoins')"
                            >
                                <i class="bx bx-expand-alt bx-xs" />
                            </Button>
                        </template>
                    </TransBarCard>
                </div>
            </section>

            <section class="md:w-2/5">
                <div class="affix-container sticky">
                    <TransBarCard title="Content" :haveDetails="true" :haveContent="false">
                        <template #header>
                            <div
                                class="flex items-center justify-between space-x-2"
                                :class="[isLoadingContents ? 'pointer-events-none' : 'cursor-pointer']"
                                @click="toggleWeb3Only()"
                            >
                                <h2 class="text-black text-opacity-50" :class="{ 'text-opacity-80': isWeb3Only }">
                                    Web3 Only
                                </h2>
                                <div
                                    class="flex h-6 w-11 items-center rounded-full bg-gray-500 bg-opacity-10 p-1 duration-200 ease-in-out"
                                >
                                    <div
                                        class="h-4 w-4 transform rounded-full bg-black bg-opacity-50 shadow-md duration-200 ease-in-out"
                                        :class="{ 'translate-x-5 bg-opacity-80': !isWeb3Only }"
                                    ></div>
                                </div>
                                <h2 class="text-black text-opacity-50" :class="{ 'text-opacity-80': !isWeb3Only }">
                                    Hybrid
                                </h2>
                            </div>
                        </template>
                        <template #details>
                            <div v-if="contents?.length > 0">
                                <div class="flex flex-col gap-4">
                                    <ContentCard
                                        v-for="element in contents"
                                        :key="element.id"
                                        :username="rss3Profile.username"
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
                                        class="h-6 w-full"
                                        v-show="isContentsHaveMore"
                                        @click="loadMoreContents"
                                        id="contents-load-more-button"
                                    >
                                        <i v-if="isLoadingContents" class="bx bx-loader-circle bx-spin"></i>
                                        <i v-else class="bx bx-dots-horizontal-rounded" />
                                    </Button>
                                </IntersectionObserverContainer>
                            </div>
                            <div v-else class="flex h-96 flex-col items-center justify-center gap-1 p-5">
                                <template v-if="isLoadingContents">
                                    <span class="text-light w-1/2 break-words text-center">
                                        One moment! Details on the way
                                    </span>
                                    <LoadingSmile :size="18" :isLooping="true" />
                                </template>
                                <template v-else>
                                    <span class="text-light w-1/2 break-words text-center">
                                        Looks like this user hasn't got a shot. Come back and check it out later.
                                    </span>
                                    <Smile :size="18" />
                                </template>
                            </div>
                        </template>
                    </TransBarCard>
                </div>
            </section>

            <Footer />
            <AccountModal
                :isShowingAccount="isShowingAccount"
                :showingAccountDetails="showingAccountDetails"
                @closeDialog="closeAccountDialog"
            />
        </div>
        <ShareCard
            v-show="isSharing"
            @close="isSharing = false"
            :address="ethAddress"
            :rns="rns"
            :avatar="rss3Profile.avatar"
            :name="rss3Profile.username"
            :score="score"
            :rank="rank"
        />
    </div>
</template>

<script lang="ts">
import { mixins, Options } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
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
import { Profile as ProfileInfo } from '@/common/types';

import FootprintCard from '@/components/Footprint/FootprintCard.vue';
import ContentCard from '@/components/Content/ContentCard.vue';
import ContentProviders from '@/common/content-providers';
import Toolbar from '@/components/Profile/Toolbar.vue';
import FootprintItem from '@/components/Footprint/FootprintItem.vue';
import EVMpAccountItem from '@/components/Account/EVMpAccountItem.vue';
import { AnyObject } from 'rss3/types/extend';
import IntersectionObserverContainer from '@/components/Common/IntersectionObserverContainer.vue';

import TransBarCard from '@/components/Card/TransBarCard.vue';
import AssetCard from '@/components/Card/AssetCard.vue';
import config from '@/common/config';
import Header from '@/components/Common/Header.vue';
import Footer from '@/components/Common/Footer.vue';
import AccountModal from '@/components/Account/AccountModal.vue';
import Smile from '@/components/Icons/Smile.vue';
import LoadingSmile from '@/components/Loading/LoadingSmile.vue';
import { formatter } from '@/common/address';

// mixins section
import { NFTMixin } from '@/views/Mixins/NFTMixin';
import { DonationMixin } from '@/views/Mixins/DonationMixin';
import { FootprintMixin } from '@/views/Mixins/FootprintMixin';
import { ContentMixin } from '@/views/Mixins/ContentMixin';
import ShareCard from '@/components/ShareCard.vue';

@Options({
    name: 'Home',
    components: {
        ShareCard,
        IntersectionObserverContainer,
        EVMpAccountItem,
        FootprintItem,
        Button,
        TransBarCard,
        Profile,
        AccountItem,
        NFTItem,
        Modal,
        GitcoinItem,
        FootprintCard,
        ContentCard,
        Toolbar,
        AssetCard,
        Header,
        Footer,
        AccountModal,
        Smile,
        LoadingSmile,
    },
})
export default class Home extends mixins(NFTMixin, DonationMixin, FootprintMixin, ContentMixin) {
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
    isAccountRegistered: boolean = true;
    isLoadingPersona: boolean = true;

    rss3Profile: ProfileInfo = {
        avatar: legacyConfig.defaultAvatar,
        username: '...',
        address: '',
        bio: '...',
        displayAddress: '',
    };
    rss3Relations: {
        followers: string[];
        followings: string[];
    } = {
        followers: [],
        followings: [],
    };
    accounts: AnyObject[] = [];
    $gtag: any;
    scrollTop: number = 0;
    lastRoute: string = '';
    undefinedImage = legacyConfig.undefinedImageAlt;
    defaultAvatar = legacyConfig.defaultAvatar;

    isPCLayout: boolean = window.innerWidth > config.ui.md;
    isOwnerValidRSS3: boolean = false;
    ownerETHAddress: string = '';

    isLastScrollingDown: boolean = false;

    // for leader board
    isRankLoading: boolean = true;
    score: string = '0';
    rank: string = '0';

    // for share
    isSharing: boolean = false;

    async mounted() {
        window.onresize = () => {
            return (() => {
                this.isPCLayout = window.innerWidth > config.ui.md;
            })();
        };
        this.mountScrollEvent();
    }

    async initLoad() {
        this.lastRoute = this.$route.fullPath;

        (<HTMLLinkElement>document.getElementById('favicon')).href = '/favicon.ico';
        document.title = 'Cheers Bio';

        this.isLoadingPersona = true;
        const aon = utils.getAddress(<string>this.$route.params.address);
        const pageOwner = await RSS3.setPageOwner(aon);
        this.isShowingAccount = false;

        if (parseInt(pageOwner.address) === 0) {
            this.$router.push('/invalid');
            return;
        }

        this.rns = pageOwner.name;
        this.ethAddress = pageOwner.address;

        utils.subDomainModeRedirect(this.rns);
        await this.updateUserInfo();
    }

    async updateUserInfo() {
        const pageOwner = RSS3.getPageOwner();
        const profile = pageOwner.profile;

        this.rss3Profile.avatar = profile?.avatar?.[0] || legacyConfig.defaultAvatar;
        this.rss3Profile.username = profile?.name || pageOwner.name || formatter(pageOwner.address);
        this.rss3Profile.address = this.ethAddress;
        this.isAccountRegistered = !!pageOwner.file?.signature;
        if (profile?.bio) {
            // Profile
            const { extracted, fieldsMatch } = utils.extractEmbedFields(profile?.bio || '', ['SITE']);
            this.rss3Profile.bio = extracted;
            this.rss3Profile.displayAddress = fieldsMatch?.['SITE'] || '';
        } else {
            if (this.isAccountRegistered) {
                this.rss3Profile.bio = '';
            } else {
                this.rss3Profile.bio =
                    'This account is not registered with RSS3. If you are the owner, you are welcome to register now : )';
            }
        }

        this.rss3Relations.followers = pageOwner.followers;
        this.rss3Relations.followings = pageOwner.followings;
        // load accounts, assets, contents and update user follow/unfollow/login state
        await Promise.all([
            this.startLoadingAccounts(),
            this.startLoadingAssets(),
            this.startLoadingContents(),
            this.startLoadingRanking(),
        ]);

        // setup affix event
        this.affixEvent(true);

        setTimeout(this.checkUserState, 0);
    }

    async checkUserState() {
        if (RSS3.isValidRSS3()) {
            await RSS3.ensureLoginUser();
            this.checkIsFollowing();
            this.isOwner = RSS3.isNowOwner();
        }

        this.isLoadingPersona = false;
    }

    async startLoadingAccounts() {
        this.accounts = [];
        const pageOwner = RSS3.getPageOwner();
        const { listed } = await utils.initAccounts();
        // Push original account
        const accounts = [
            {
                id: RSS3Utils.id.getAccount('EVM+', pageOwner?.address),
            },
        ].concat(listed);
        this.accounts = accounts.map((account) => RSS3Utils.id.parseAccount(account.id));
    }

    async startLoadingAssets() {
        this.isLoadingNFT = true;
        this.isLoadingDonation = true;
        this.isLoadingFootprint = true;
        const allAssets = await utils.initAssets();
        // laod NFT, donation and footprint
        await Promise.all([
            this.ivLoadNFT(allAssets.nftsWithClassName),
            this.ivLoadGitcoin(allAssets.donations.slice(0, config.assets.brief)),
            this.ivLoadFootprint(allAssets.footprints.slice(0, config.assets.brief)),
        ]);
    }

    startLoadingRanking() {
        this.isRankLoading = true;
        fetch(`https://raas.cheer.bio/user/${this.ethAddress}`)
            .then((res: any) => res.json())
            .then((res) => {
                this.score = res.user.score.toFixed(2);
                this.rank = `${res.user.rank}`;
            })
            .catch((res) => {});

        this.isRankLoading = false;
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
            document.title = 'Cheers Bio';

            utils.setCrossDomainStorage('redirectFrom', window.location.href); // Cross domain redirect
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

    toLeaderboard() {
        this.$router.push('/leaderboard');
    }

    toManageAccounts() {
        this.$router.push('/setup/accounts');
    }
    toManageNFTs(className: string) {
        sessionStorage.setItem('NFTEditDefaultExpandClassName', className);
        this.$router.push('/setup/nfts');
    }
    toManageGitcoins() {
        this.$router.push('/setup/gitcoins');
    }
    toManageFootprints() {
        this.$router.push('/setup/footprints');
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
                `/${type.toLowerCase()}`,
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
            link = `https://${this.isPCLayout ? 'web' : 'm'}.okjike.com/${
                this.isPCLayout ? 'originalPost' : 'originalPosts'
            }/${content.target.action.payload}`;
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

    closeAccountDialog() {
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

    mountScrollEvent() {
        const el = this.$el;
        if (el) {
            el.addEventListener('scroll', (ev) => {
                this.affixEvent(el.scrollTop > this.scrollTop);
                this.scrollTop = el.scrollTop;
            });
        }
    }

    async activated() {
        if (this.lastRoute === this.$route.fullPath) {
            // Recover scroll position
            const el = document.getElementById('main');
            if (el) {
                el.scrollTop = this.scrollTop;
            }
            this.clearContentDetails();
            await this.updateUserInfo();
        } else {
            this.isFollowing = false;
            this.isOwner = false;
            this.rss3Profile = {
                avatar: legacyConfig.defaultAvatar,
                username: '...',
                address: '',
                bio: '...',
                displayAddress: '',
            };
            this.clearNFTDetails();
            this.clearDonationDetails();
            this.clearFootprintDetails();
            this.clearContentDetails();
            await this.initLoad();
        }
    }

    affixEvent(isScrollDown: boolean) {
        if (window.innerWidth > config.ui.md) {
            // Enable
            const containers = document.querySelectorAll('.affix-container') as NodeListOf<HTMLElement>;
            if (isScrollDown) {
                if (!this.isLastScrollingDown) {
                    containers.forEach((container) => {
                        const realHeight = container.clientHeight + 50; // why?
                        if (window.innerHeight < realHeight) {
                            container.style.top = `${window.innerHeight - realHeight}px`;
                        } else {
                            container.style.top = '32px';
                        }
                    });
                }
            } // else TODO
            this.isLastScrollingDown = isScrollDown;
        }
    }

    openShareCard() {
        this.isSharing = true;
    }
}
</script>

<style></style>
