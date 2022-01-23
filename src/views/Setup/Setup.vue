<template>
    <div class="h-screen text-body-text overflow-y-auto">
        <div class="flex flex-col gap-y-4 m-auto pb-20 pt-8 px-4 max-w-md">
            <div class="mb-6 text-center">
                <h1 class="text-xl font-bold">Setup</h1>
            </div>
            <AvatarEditor class="m-auto" size="lg" :url="profile.avatar" ref="avatar" />
            <Input class="w-full" :is-single-line="true" placeholder="Username" v-model="profile.name" />
            <Input
                class="w-full"
                :is-single-line="true"
                placeholder="Personal link"
                prefix="https://"
                v-model="profile.link"
            />
            <Input class="w-full" :is-single-line="false" placeholder="Bio" v-model="profile.bio" />

            <TransBarCard title="Accounts" :haveContent="true" :haveContentInfo="accounts.length > 0">
                <template #header>
                    <Button size="sm" class="w-8 h-8 text-btn-icon bg-secondary-btn-card" @click="toManageAccounts">
                        <i class="bx bx-plus bx-xs cursor-pointer" />
                    </Button>
                </template>
                <template #content>
                    <div
                        class="inline-flex m-0.5 rounded-full"
                        v-for="item in accounts"
                        :key="item.platform + item.identity"
                    >
                        <EVMpAccountItem v-if="item.platform === 'EVM+'" :size="40" :address="item.identity" />
                        <AccountItem v-else :size="40" :chain="item.platform" :address="item.identity" />
                    </div>
                </template>
            </TransBarCard>

            <TransBarCard
                title="Vitrine"
                :tip="isLoadingAssets.NFT ? 'Loading...' : 'Haven\'t found anything yet...'"
                :haveDetails="false"
                :haveContent="true"
                :haveContentInfo="nfts.length > 0"
            >
                <template #header>
                    <Button size="sm" class="w-8 h-8 text-btn-icon bg-secondary-btn-card" @click="toManageNFTs">
                        <i class="bx bx-plus bx-xs cursor-pointer" />
                    </Button>
                </template>
                <template #content>
                    <NFTItem
                        class="inline-flex mx-0.5"
                        v-for="asset in nfts"
                        :key="asset.id"
                        size="sm"
                        :image-url="asset.detail.animation_url || asset.detail.image_preview_url"
                        :poster-url="asset.detail.image_preview_url"
                    />
                </template>
            </TransBarCard>

            <TransBarCard
                title="Donations"
                :tip="isLoadingAssets.Gitcoin ? 'Loading...' : 'Haven\'t found anything yet...'"
                :haveDetails="gitcoins.length !== 0"
                :haveContent="true"
                :haveContentInfo="gitcoins.length > 0"
            >
                <template #header>
                    <Button size="sm" class="w-8 h-8 text-btn-icon bg-secondary-btn-card" @click="toManageGitcoins">
                        <i class="bx bx-plus bx-xs cursor-pointer" />
                    </Button>
                </template>
                <template #content>
                    <GitcoinItem
                        class="inline-flex mx-0.5"
                        v-for="item in gitcoins"
                        :key="item.id"
                        size="sm"
                        :imageUrl="item.detail.grant.logo"
                    />
                </template>
            </TransBarCard>

            <TransBarCard
                title="Footprints"
                :tip="isLoadingAssets.Footprint ? 'Loading...' : 'Haven\'t found anything yet...'"
                :haveDetails="false"
                :haveContent="true"
                :haveContentInfo="footprints.length > 0"
            >
                <template #header>
                    <Button size="sm" class="w-8 h-8 text-btn-icon bg-secondary-btn-card" @click="toManageFootprints">
                        <i class="bx bx-plus bx-xs cursor-pointer" />
                    </Button>
                </template>
                <template #content>
                    <FootprintItem
                        class="inline-flex mx-0.5"
                        v-for="asset in footprints"
                        :key="asset.id"
                        size="sm"
                        :image-url="asset.detail.image_url"
                    />
                </template>
            </TransBarCard>

            <TransBarCard title="Contents" :haveContent="true" :haveContentInfo="true">
                <template #content>
                    <span>Check out in homepage!</span>
                </template>
            </TransBarCard>

            <div class="flex gap-5 justify-between">
                <Button
                    size="sm"
                    class="text-secondary-btn-text flex-1 h-9 text-lg bg-secondary-btn opacity-80"
                    @click="back"
                >
                    <span>Back</span>
                </Button>
                <Button size="sm" class="flex-1 h-9 text-body-text text-lg bg-primary-btn opacity-80" @click="save">
                    <span>Done</span>
                </Button>
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
                        <Button size="sm" class="w-72 text-body-text bg-primary-btn" @click="isShowingNotice = false">
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
import Button from '@/components/Button/Button.vue';
import AvatarEditor from '@/components/Profile/AvatarEditor.vue';
import BarCard from '@/components/Card/BarCard.vue';
import TransBarCard from '@/components/Card/TransBarCard.vue';
import AccountItem from '@/components/Account/AccountItem.vue';
import NFTItem from '@/components/NFT/NFTItem.vue';
import Input from '@/components/Input/Input.vue';
import Modal from '@/components/Common/Modal.vue';
import Loading from '@/components/Loading/Loading.vue';
import LoadingContainer from '@/components/Loading/LoadingContainer.vue';
import RSS3 from '@/common/rss3';
import { utils as RSS3Utils } from 'rss3';
import config from '@/common/config';

import NFTIcon from '@/components/Icons/NFTIcon.vue';
import GitcoinIcon from '@/components/Icons/GitcoinIcon.vue';
import ContentIcon from '@/components/Icons/ContentIcon.vue';
import AccountIcon from '@/components/Icons/AccountIcon.vue';
import FootprintIcon from '@/components/Icons/FootprintIcon.vue';

import { DetailedFootprint, DetailedDonation, DetailedNFT } from '@/common/types';
import GitcoinItem from '@/components/Donation/GitcoinItem.vue';
import FootprintItem from '@/components/Footprint/FootprintItem.vue';
import EVMpAccountItem from '@/components/Account/EVMpAccountItem.vue';
import utils from '@/common/utils';

@Options({
    name: 'Setup',
    components: {
        EVMpAccountItem,
        FootprintItem,
        Modal,
        Button,
        AvatarEditor,
        BarCard,
        TransBarCard,
        GitcoinItem,
        AccountItem,
        NFTItem,
        Input,
        Loading,
        LoadingContainer,
        AccountIcon,
        NFTIcon,
        GitcoinIcon,
        ContentIcon,
        FootprintIcon,
    },
})
export default class Setup extends Vue {
    profile: {
        avatar: string;
        name: string;
        bio: string;
        link: string;
    } = {
        avatar: config.undefinedImageAlt,
        name: '',
        bio: '',
        link: '',
    };
    accounts: {
        platform: string;
        identity: string;
    }[] = [];
    nfts: DetailedNFT[] = [];
    gitcoins: DetailedDonation[] = [];
    footprints: DetailedFootprint[] = [];
    isLoading: Boolean = true;
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
    maxValueLength: Number = 280;
    notice: String = '';
    isShowingNotice: Boolean = false;
    currentTheme: string = '';
    $gtag: any;
    lastRoute: string = '';

    async initLoad() {
        this.isLoading = true;
        await utils.tryEnsureOrRedirect(this.$route, this.$router);
        await RSS3.ensureLoginUser();
        const loginUser = await RSS3.getLoginUser();
        await RSS3.setPageOwner(loginUser.address);
        const profile = loginUser.profile;
        this.profile.avatar = profile?.avatar?.[0] || config.undefinedImageAlt;
        this.profile.name = profile?.name || '';
        this.profile.bio = profile?.bio || '';

        if (profile?.bio) {
            // Profile
            const { extracted, fieldsMatch } = utils.extractEmbedFields(profile?.bio || '', ['SITE']);
            this.profile.bio = extracted;
            this.profile.link = fieldsMatch?.['SITE'] || '';
        }

        // Load assets
        setTimeout(this.startLoadingAssets, 0);

        // this.startLoadingAssets();
        this.isLoading = false;
    }

    startLoadingAccounts() {
        this.accounts = [];
        setTimeout(async () => {
            await RSS3.ensureLoginUser();
            const { listed } = await utils.initAccounts(RSS3.getLoginUser());
            const accountList = listed.map((account) => RSS3Utils.id.parseAccount(account.id));
            this.accounts = [
                {
                    platform: 'EVM+',
                    identity: RSS3.getLoginUser().address,
                },
            ].concat(accountList);
        }, 0);
    }
    async startLoadingAssets() {
        const { nfts, donations, footprints } = await utils.initAssets();
        setTimeout(async () => {
            this.nfts = await utils.loadAssets(nfts.slice(0, config.assets.brief));
            this.isLoadingAssets.NFT = false;
        }, 0);
        setTimeout(async () => {
            this.gitcoins = await utils.loadAssets(donations.slice(0, config.assets.brief));
            this.isLoadingAssets.Gitcoin = false;
        }, 0);
        setTimeout(async () => {
            this.footprints = await utils.loadAssets(footprints.slice(0, config.assets.brief));
            this.isLoadingAssets.Footprint = false;
        }, 0);
    }

    toManageAccounts() {
        // this.saveEdited();
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

    back() {
        const pageOwner = RSS3.getPageOwner();
        const rns = pageOwner.name;
        const ethAddress = pageOwner.address;

        if (window.history.state.back) {
            window.history.back();
        } else {
            this.$router.push(config.subDomain.preferSubDomainMode ? '/' : `/${rns || ethAddress}`);
        }
    }

    async save() {
        this.isLoading = true;
        const loginUser = await RSS3.getLoginUser();
        if (this.profile.name.length > this.maxValueLength) {
            this.notice = `Name cannot be longer than ${this.maxValueLength} chars`;
            this.isLoading = false;
            this.isShowingNotice = true;
            return;
        }
        if (this.profile.bio?.length + this.profile.link?.length + 8 > this.maxValueLength) {
            this.notice = `Bio cannot be longer than ${this.maxValueLength} chars`;
            this.isLoading = false;
            this.isShowingNotice = true;
            return;
        }
        const newProfile: RSS3Profile = {
            avatar: [this.profile.avatar],
            name: this.profile.name,
            bio: this.profile.bio + (this.profile.link ? `<SITE#${this.profile.link}>` : ''),
        };

        // Upload avatar
        const avatarUrl = await (<any>this.$refs.avatar).upload();
        if (avatarUrl) {
            newProfile.avatar = [avatarUrl];
        }
        await loginUser.persona.profile.patch(newProfile);
        // Save
        try {
            await loginUser.persona.files.sync();
        } catch (e) {
            console.log(e);
            this.isLoading = false;
            return;
        }
        // this.clearEdited();
        this.$gtag.event('finishEditProfile', { userid: loginUser.address });
        this.isLoading = false;
        await RSS3.reloadLoginUser();
        await RSS3.reloadPageOwner();
        const pageOwner = RSS3.getPageOwner();
        const rns = pageOwner.name;
        const ethAddress = pageOwner.address;
        const redirectFrom = sessionStorage.getItem('redirectFrom');
        sessionStorage.removeItem('redirectFrom');
        await this.$router.push(config.subDomain.preferSubDomainMode ? redirectFrom || '/' : `/${rns || ethAddress}`);
    }

    async mounted() {
        await this.initLoad();
    }

    async activated() {
        this.startLoadingAccounts();
        await this.startLoadingAssets();
    }

    deactivated() {
        if (this.loadingAssetsIntervalID) {
            clearInterval(this.loadingAssetsIntervalID);
            this.loadingAssetsIntervalID = null;
        }
        this.isLoading = false;
    }
}
</script>

<style lang="postcss" scoped></style>
