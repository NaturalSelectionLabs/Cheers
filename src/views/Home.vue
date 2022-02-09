<template>
    <div id="main" class="m-auto pb-12 pt-8 px-4 max-w-screen-lg text-body-text">
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
                                class="inline-block mr-1 w-8 h-8 text-btn-icon bg-secondary-btn-card"
                                @click="toManageAccounts"
                            >
                                <i class="bx bx-pencil bx-xs" />
                            </Button>
                            <Button
                                size="sm"
                                shape="circle"
                                class="inline-block mr-1 w-8 h-8 text-btn-icon bg-secondary-btn-card"
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

                    <template v-for="className in allClasses" :key="className">
                        <TransBarCard
                            v-if="className === 'Collectibles'"
                            :title="className"
                            :tip="isLoadingAssets.NFT ? 'loading' : isOwner ? 'ownerEmpty' : 'notOwnerEmpty'"
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
                                        class="absolute -right-1.5 -top-1.5 inline-flex w-2 h-2 bg-red-500 rounded-full"
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
                                    class="w-8 h-8 text-btn-icon bg-secondary-btn-card"
                                    @click="toListPage(`nfts/${className}`)"
                                >
                                    <i class="bx bx-expand-alt bx-xs" />
                                </Button>
                            </template>
                        </TransBarCard>

                        <TransBarCard
                            v-else
                            :title="className"
                            :tip="isLoadingAssets.NFT ? 'loading' : isOwner ? 'ownerEmpty' : 'notOwnerEmpty'"
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
                                        defaultAvatar
                                    "
                                    size="sm"
                                    @click="toSingleItemPage(item.id)"
                                />
                            </template>
                            <template #button>
                                <Button
                                    size="sm"
                                    class="w-8 h-8 text-btn-icon bg-secondary-btn-card"
                                    @click="toListPage(`nfts/${className}`)"
                                >
                                    <i class="bx bx-expand-alt bx-xs" />
                                </Button>
                            </template>
                        </TransBarCard>
                    </template>

                    <TransBarCard
                        title="Footprints"
                        :tip="isLoadingAssets.Footprint ? 'loading' : isOwner ? 'ownerEmpty' : 'notOwnerEmpty'"
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
                                class="flex-shrink-0 mr-2 cursor-pointer"
                                @click="toSingleItemPage(item.id)"
                            />
                        </template>
                        <template #button>
                            <Button
                                size="sm"
                                class="w-8 h-8 text-btn-icon bg-secondary-btn-card"
                                @click="toListPage('Footprints')"
                            >
                                <i class="bx bx-expand-alt bx-xs" />
                            </Button>
                        </template>
                    </TransBarCard>

                    <TransBarCard
                        title="Donations"
                        :tip="isLoadingAssets.Gitcoin ? 'loading' : isOwner ? 'ownerEmpty' : 'notOwnerEmpty'"
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
                                class="w-8 h-8 text-btn-icon bg-secondary-btn-card"
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
                            <div class="flex flex-col gap-y-2" :class="{ 'pointer-events-none': isLoadingContents }">
                                <div class="flex gap-2 items-center justify-between" @click="toggleWeb3Only()">
                                    <h2
                                        class="text-black text-opacity-50"
                                        :class="{ 'translate-x-5 text-opacity-80': isWeb3Only }"
                                    >
                                        Web3 Only
                                    </h2>
                                    <div
                                        class="flex items-center p-1 w-11 h-6 bg-gray-500 bg-opacity-10 rounded-full cursor-pointer duration-200 ease-in-out"
                                    >
                                        <div
                                            class="w-4 h-4 bg-black bg-opacity-50 rounded-full shadow-md transform duration-200 ease-in-out"
                                            :class="{ 'translate-x-5 bg-opacity-80': !isWeb3Only }"
                                        />
                                    </div>
                                    <h2
                                        class="text-black text-opacity-50"
                                        :class="{ 'translate-x-5 text-opacity-80': !isWeb3Only }"
                                    >
                                        Hybrid
                                    </h2>
                                </div>
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
                                        class="w-full h-6"
                                        v-show="isContentsHaveMore"
                                        @click="loadMoreContents"
                                        id="contents-load-more-button"
                                    >
                                        <i v-if="isLoadingContents" class="bx bx-loader-circle bx-spin"></i>
                                        <i v-else class="bx bx-dots-horizontal-rounded" />
                                    </Button>
                                </IntersectionObserverContainer>
                            </div>
                            <div v-else class="flex flex-col gap-1 items-center justify-center p-5 h-96">
                                <template v-if="isLoadingContents">
                                    <span class="text-light w-1/2 text-center break-words">
                                        One moment! Details on the way
                                    </span>
                                    <LoadingSmile :size="18" :isLooping="true" />
                                </template>
                                <template v-else>
                                    <span class="text-light w-1/2 text-center break-words">
                                        Looks like this user hasn't got a shot. Come back and check it out later.
                                    </span>
                                    <Smile :size="18" />
                                </template>
                            </div>
                        </template>
                    </TransBarCard>
                </div>
            </section>

            <div class="safe-area-fixed-bottom bg-footer-bg fixed bottom-0 left-0 mt-2 w-full">
                <div class="flex flex-row gap-x-2 items-center justify-end m-auto px-4 py-2 max-w-screen-lg">
                    <div class="text-right text-body-text text-xs font-normal">
                        <a href="https://rss3.io/#/privacy"> Privacy </a>
                        |
                        <span>
                            Made with 🌀 by
                            <a
                                href="https://rss3.io"
                                class="text-body-text no-underline visited:no-underline active:no-underline text-xs font-normal"
                            >
                                RSS3
                            </a>
                        </span>
                    </div>
                </div>
            </div>
            <AccountModal
                :isShowingAccount="isShowingAccount"
                :showingAccountDetails="showingAccountDetails"
                @closeDialog="closeAccountDialog"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
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
import { Profile as ProfileInfo, GeneralAsset, DetailedNFT, GeneralAssetWithClass } from '@/common/types';

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
import AccountModal from '@/components/Account/AccountModal.vue';
import Smile from '@/components/Icons/Smile.vue';
import LoadingSmile from '@/components/Loading/LoadingSmile.vue';
import flattenDeep from 'lodash/flattenDeep';
import { formatter } from '@/common/address';

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
        AccountModal,
        Smile,
        LoadingSmile,
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
    isAccountRegistered: boolean = true;
    isLoadingAssets: {
        NFT: boolean;
        Gitcoin: boolean;
        Footprint: boolean;
    } = {
        NFT: true,
        Gitcoin: true,
        Footprint: true,
    };
    isLoadingContents: boolean = true;
    isContentsHaveMore: boolean = true;
    isLoadingMore: boolean = false;
    currentTheme: string = '';
    isLoadingPersona: boolean = true;
    isWeb3Only: boolean = false;

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
    // nfts: AnyObject[] = [];
    gitcoins: AnyObject[] = [];
    footprints: AnyObject[] = [];
    contents: any[] = [];
    contentTimestamp: string = '';
    $gtag: any;
    scrollTop: number = 0;
    lastRoute: string = '';
    undefinedImage = legacyConfig.undefinedImageAlt;
    defaultAvatar = legacyConfig.defaultAvatar;
    // notice: string = '';
    // isShowingNotice: boolean = false;

    isPCLayout: boolean = window.innerWidth > config.ui.md;
    isOwnerValidRSS3: boolean = false;
    ownerETHAddress: string = '';

    isLastScrollingDown: boolean = false;

    classifiedList: {
        [className: string]: DetailedNFT[];
    } = {
        Collectibles: [],
        // Games: [],
        // Awards: [],
        // Organizations: [],
    };
    allClasses: string[] = Object.keys(this.classifiedList);

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
            this.checkUserState(),
        ]);

        // setup affix event
        this.affixEvent(true);
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
        this.isLoadingAssets = {
            NFT: true,
            Gitcoin: true,
            Footprint: true,
        };
        const allAssets = await utils.initAssets();
        // laod NFT, donation and footprint
        await Promise.all([
            this.ivLoadNFT(allAssets.nftsWithClassName),
            this.ivLoadGitcoin(allAssets.donations.slice(0, config.assets.brief)),
            this.ivLoadFootprint(allAssets.footprints.slice(0, config.assets.brief)),
        ]);
    }

    async ivLoadNFT(assets: GeneralAssetWithClass[]) {
        const nftsWithClassName = this.generateNFTsWithClassName(assets);
        const assetIDList = nftsWithClassName.map((asset) =>
            RSS3Utils.id.getAsset(asset.platform, asset.identity, asset.type, asset.uniqueID),
        );
        if (assetIDList.length === 0) {
            this.isLoadingAssets.NFT = false;
            return;
        }
        let displayedNFTsDetail: AnyObject[] = [];
        for (let i = 0; i < 10; i++) {
            if (displayedNFTsDetail.length !== 0) {
                this.isLoadingAssets.NFT = false;
            }
            const assetsNoDetails = assetIDList.filter(
                (asset) => !displayedNFTsDetail.find((detail) => detail.id === asset),
            );

            if (!assetsNoDetails.length) {
                // all the assets have details, break
                break;
            } else {
                // already request but not get full details
                // sleep for two seconds
                await new Promise((r) => setTimeout(r, 2000));
            }
            console.log(`NFT retry ${i} times`);
            displayedNFTsDetail = displayedNFTsDetail.concat(await utils.loadAssetsWithNoRetry(assetsNoDetails));
            this.sortNFTDetails(nftsWithClassName, displayedNFTsDetail);
        }
    }

    generateNFTsWithClassName(assets: GeneralAssetWithClass[]) {
        // Get NFTs
        const classifiedBriefList: {
            [className: string]: GeneralAssetWithClass[];
        } = {};

        assets.map((nft) => {
            const className = nft.class || 'Collectibles';
            if (!(className in classifiedBriefList)) {
                classifiedBriefList[className] = [];
            }
            if (classifiedBriefList[className].length < config.assets.brief) {
                classifiedBriefList[className].push(nft);
            }
        });

        const nftsWithClassName = flattenDeep(Object.values(classifiedBriefList));
        return nftsWithClassName;
    }

    sortNFTDetails(nftsWithClassName: GeneralAssetWithClass[], displayedNFTsDetail: AnyObject[]) {
        const classifiedList: {
            [className: string]: DetailedNFT[];
        } = {
            Collectibles: [],
            Games: [],
            Awards: [],
            Organizations: [],
        };
        nftsWithClassName.map((nft) => {
            const className = nft.class || 'Collectibles';
            if (!(className in classifiedList)) {
                classifiedList[className] = [];
            }
            const detailedNFT = displayedNFTsDetail.find(
                (dNFT) => dNFT.id === RSS3Utils.id.getAsset(nft.platform, nft.identity, nft.type, nft.uniqueID),
            );
            if (detailedNFT) {
                classifiedList[className].push(detailedNFT);
            }
        });
        Object.keys(classifiedList).map((listName) => {
            if (classifiedList[listName].length === 0 && listName !== 'Collectibles') {
                delete classifiedList[listName];
            }
        });

        this.classifiedList = classifiedList;
        this.allClasses = Object.keys(this.classifiedList);
    }

    async ivLoadGitcoin(assets: GeneralAsset[]) {
        if (assets) {
            if (assets.length === 0) {
                this.isLoadingAssets.Gitcoin = false;
                return;
            }
            const assetIDList = assets.map((asset) =>
                RSS3Utils.id.getAsset(asset.platform, asset.identity, asset.type, asset.uniqueID),
            );
            let displayedGitcoinsDetail: AnyObject[] = [];
            for (let i = 0; i < 10; i++) {
                if (displayedGitcoinsDetail.length !== 0) {
                    this.isLoadingAssets.Gitcoin = false;
                }
                const assetsNoDetails = assetIDList.filter(
                    (asset) => !this.gitcoins.find((detail) => detail.id === asset),
                );

                if (!assetsNoDetails.length) {
                    // all the assets have details, break
                    break;
                } else {
                    // already request but not get full details
                    // sleep for two seconds
                    await new Promise((r) => setTimeout(r, 2000));
                }
                console.log(`Donations retry ${i} times`);
                displayedGitcoinsDetail = displayedGitcoinsDetail.concat(
                    await utils.loadAssetsWithNoRetry(assetsNoDetails),
                );
                this.gitcoins = this.sortAssets(assetIDList, displayedGitcoinsDetail);
            }
        }
    }

    async ivLoadFootprint(assets: GeneralAsset[]) {
        if (assets) {
            if (assets.length === 0) {
                this.isLoadingAssets.Footprint = false;
                return;
            }
            const assetIDList = assets.map((asset) =>
                RSS3Utils.id.getAsset(asset.platform, asset.identity, asset.type, asset.uniqueID),
            );
            let displayFootprintsDetail: AnyObject[] = [];
            for (let i = 0; i < 10; i++) {
                if (displayFootprintsDetail.length !== 0) {
                    this.isLoadingAssets.Footprint = false;
                }
                const assetsNoDetails = assetIDList.filter(
                    (asset) => !this.footprints.find((detail) => detail.id === asset),
                );

                if (!assetsNoDetails.length) {
                    // all the assets have details, break
                    break;
                } else {
                    // already request but not get full details
                    // sleep for two seconds
                    await new Promise((r) => setTimeout(r, 2000));
                }
                console.log(`Footprint retry ${i} times`);
                displayFootprintsDetail = displayFootprintsDetail.concat(
                    await utils.loadAssetsWithNoRetry(assetsNoDetails),
                );
                this.footprints = this.sortAssets(assetIDList, displayFootprintsDetail);
            }
        }
    }

    sortAssets(assetIDList: string[], assetDetailsList: AnyObject[]) {
        const sortedAssetDetailsList: AnyObject[] = [];
        assetIDList.map((assetID) => {
            const detailedAsset = assetDetailsList.find((details) => details.id === assetID);
            if (detailedAsset) {
                sortedAssetDetailsList.push(detailedAsset);
            }
        });

        return sortedAssetDetailsList;
    }

    async startLoadingContents() {
        const localStoreIsWeb3Only = JSON.parse(utils.getStorage('isWeb3Only') || 'false');
        this.isWeb3Only = localStoreIsWeb3Only;
        const { listed, haveMore, timestamp } = await utils.initContent('', this.isWeb3Only);
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
    }

    async loadMoreContents() {
        this.isLoadingContents = true;

        if (this.isContentsHaveMore) {
            const { listed, haveMore, timestamp } = await utils.initContent(this.contentTimestamp, this.isWeb3Only);
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

    async updateFilteredContent() {
        const { listed, haveMore, timestamp } = await utils.initContent('', this.isWeb3Only);
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

    async toggleWeb3Only() {
        this.isLoadingContents = true;
        this.contents = [];
        if (this.isWeb3Only !== undefined) {
            this.isWeb3Only = !this.isWeb3Only;
            utils.setStorage('isWeb3Only', JSON.stringify(this.isWeb3Only));
        }
        await this.updateFilteredContent();
        this.isLoadingContents = false;
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
            this.contents = [];
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
            // this.nfts = [];
            this.classifiedList = {
                Collectibles: [],
                // Games: [],
                // Awards: [],
                // Organizations: [],
            };
            this.gitcoins = [];
            this.footprints = [];
            await this.initLoad();
        }
    }

    affixEvent(isScrollDown: boolean) {
        if (window.innerWidth > config.ui.md) {
            // Enable
            const containers = document.querySelectorAll('.affix-container');
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
}
</script>

<style></style>
