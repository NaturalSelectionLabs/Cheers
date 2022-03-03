<template>
    <div class="m-auto flex max-w-md flex-col gap-y-4 px-4 pb-20 pt-8 text-body-text">
        <div class="mb-6 text-center">
            <h1 class="text-xl font-bold">Setup</h1>
        </div>
        <AvatarEditor class="m-auto" size="lg" :url="profile.avatar || defaultAvatar" ref="avatar" />
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
                <Button size="sm" class="h-8 w-8 bg-secondary-btn-card text-btn-icon" @click="toManageAccounts">
                    <i class="bx bx-plus bx-xs cursor-pointer" />
                </Button>
            </template>
            <template #content>
                <div
                    class="m-0.5 inline-flex rounded-full"
                    v-for="item in accounts"
                    :key="item.platform + item.identity"
                >
                    <EVMpAccountItem v-if="item.platform === 'EVM+'" :size="40" :address="item.identity" />
                    <AccountItem v-else :size="40" :chain="item.platform" :address="item.identity" />
                </div>
            </template>
        </TransBarCard>

        <template v-for="className in allClasses" :key="className">
            <TransBarCard
                v-if="className === 'Collectibles'"
                :title="className"
                :tip="isLoadingNFT ? 'loading' : 'ownerEmpty'"
                :haveDetails="false"
                :haveContent="true"
                :haveContentInfo="classifiedList[className].length > 0"
            >
                <template #header>
                    <Button size="sm" class="h-8 w-8 bg-secondary-btn-card text-btn-icon" @click="toManageNFTs">
                        <i class="bx bx-plus bx-xs cursor-pointer" />
                    </Button>
                </template>
                <template #content>
                    <NFTItem
                        class="mx-0.5 inline-flex"
                        v-for="asset in classifiedList[className]"
                        :key="asset.id"
                        size="sm"
                        :image-url="asset.detail.animation_url || asset.detail.image_preview_url"
                        :poster-url="asset.detail.image_preview_url"
                    />
                </template>
            </TransBarCard>

            <TransBarCard
                v-else
                :title="className"
                :tip="isLoadingNFT ? 'loading' : 'ownerEmpty'"
                :haveDetails="classifiedList[className].length > 0"
                :haveContent="true"
                :haveContentInfo="classifiedList[className].length > 0"
            >
                <template #header>
                    <Button size="sm" class="h-8 w-8 bg-secondary-btn-card text-btn-icon" @click="toManageNFTs">
                        <i class="bx bx-plus bx-xs cursor-pointer" />
                    </Button>
                </template>
                <template #content>
                    <NFTItem
                        class="mx-0.5 inline-flex"
                        v-for="asset in classifiedList[className]"
                        :key="asset.id"
                        size="sm"
                        :image-url="asset.detail.animation_url || asset.detail.image_preview_url"
                        :poster-url="asset.detail.image_preview_url"
                    />
                </template>
            </TransBarCard>
        </template>

        <TransBarCard
            title="Donations"
            :tip="isLoadingDonation ? 'loading' : 'ownerEmpty'"
            :haveDetails="gitcoins.length !== 0"
            :haveContent="true"
            :haveContentInfo="gitcoins.length > 0"
        >
            <template #header>
                <Button size="sm" class="h-8 w-8 bg-secondary-btn-card text-btn-icon" @click="toManageGitcoins">
                    <i class="bx bx-plus bx-xs cursor-pointer" />
                </Button>
            </template>
            <template #content>
                <GitcoinItem
                    class="mx-0.5 inline-flex"
                    v-for="item in gitcoins"
                    :key="item.id"
                    size="sm"
                    :imageUrl="item.detail.grant.logo"
                />
            </template>
        </TransBarCard>

        <TransBarCard
            title="Footprints"
            :tip="isLoadingFootprint ? 'loading' : 'ownerEmpty'"
            :haveDetails="false"
            :haveContent="true"
            :haveContentInfo="footprints.length > 0"
        >
            <template #header>
                <Button size="sm" class="h-8 w-8 bg-secondary-btn-card text-btn-icon" @click="toManageFootprints">
                    <i class="bx bx-plus bx-xs cursor-pointer" />
                </Button>
            </template>
            <template #content>
                <FootprintItem
                    class="mx-0.5 inline-flex"
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

        <div class="flex justify-between gap-5">
            <Button
                size="sm"
                class="text-secondary-btn-text h-9 flex-1 bg-secondary-btn text-lg opacity-80"
                @click="back"
            >
                <span>Back</span>
            </Button>
            <Button size="sm" class="h-9 flex-1 bg-primary-btn text-lg text-body-text opacity-80" @click="save">
                <span>Done</span>
            </Button>
        </div>
        <LoadingContainer v-show="isLoading" :isLooping="true" />

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
                    <Button size="sm" class="w-72 bg-primary-btn text-body-text" @click="isShowingNotice = false">
                        OK
                    </Button>
                </div>
            </template>
        </Modal>
    </div>
</template>

<script lang="ts">
import { mixins, Options } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import AvatarEditor from '@/components/Profile/AvatarEditor.vue';
import TransBarCard from '@/components/Card/TransBarCard.vue';
import AccountItem from '@/components/Account/AccountItem.vue';
import NFTItem from '@/components/NFT/NFTItem.vue';
import Input from '@/components/Input/Input.vue';
import Modal from '@/components/Common/Modal.vue';
import Loading from '@/components/Loading/Loading.vue';
import LoadingContainer from '@/components/Loading/LoadingContainer.vue';
import RSS3 from '@/common/rss3';
import { utils as RSS3Utils } from 'rss3';
import legacyConfig from '@/config';
import config from '@/common/config';

import GitcoinItem from '@/components/Donation/GitcoinItem.vue';
import FootprintItem from '@/components/Footprint/FootprintItem.vue';
import EVMpAccountItem from '@/components/Account/EVMpAccountItem.vue';
import utils from '@/common/utils';

// mixins section
import { NFTMixin } from '@/views/Mixins/NFTMixin';
import { DonationMixin } from '@/views/Mixins/DonationMixin';
import { FootprintMixin } from '@/views/Mixins/FootprintMixin';

@Options({
    name: 'Setup',
    components: {
        EVMpAccountItem,
        FootprintItem,
        Modal,
        Button,
        AvatarEditor,
        TransBarCard,
        GitcoinItem,
        AccountItem,
        NFTItem,
        Input,
        Loading,
        LoadingContainer,
    },
})
export default class Setup extends mixins(NFTMixin, DonationMixin, FootprintMixin) {
    profile: {
        avatar?: string;
        name: string;
        bio: string;
        link: string;
    } = {
        name: '',
        bio: '',
        link: '',
    };
    accounts: {
        platform: string;
        identity: string;
    }[] = [];
    isLoading: Boolean = false;
    maxValueLength: Number = 280;
    notice: String = '';
    isShowingNotice: Boolean = false;
    $gtag: any;
    lastRoute: string = '';
    defaultAvatar: string = legacyConfig.defaultAvatar;

    async initLoad() {
        await utils.tryEnsureOrRedirect(this.$route, this.$router);
        await RSS3.ensureLoginUser();
        const loginUser = RSS3.getLoginUser();
        await RSS3.setPageOwner(loginUser.address);
        const profile = loginUser.profile;
        this.profile.avatar = profile?.avatar?.[0];
        this.profile.name = profile?.name || '';
        this.profile.bio = profile?.bio || '';

        if (profile?.bio) {
            // Profile
            const { extracted, fieldsMatch } = utils.extractEmbedFields(profile?.bio || '', ['SITE']);
            this.profile.bio = extracted;
            this.profile.link = fieldsMatch?.['SITE'] || '';
        }

        await Promise.all([this.startLoadingAccounts(), this.startLoadingAssets()]);
    }

    async startLoadingAccounts() {
        this.accounts = [];
        const { listed } = await utils.initAccounts();
        // Push original account
        const accounts = [
            {
                id: RSS3Utils.id.getAccount('EVM+', RSS3.getPageOwner().address),
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

    toManageAccounts() {
        // this.saveEdited();
        this.$router.push('/setup/accounts');
    }

    toManageNFTs() {
        // this.saveEdited();
        if (this.isLoadingNFT) {
            this.notice = 'NFTs still loading... Maybe check back later?';
            this.isShowingNotice = true;
        } else {
            this.$router.push('/setup/nfts');
        }
    }

    toManageGitcoins() {
        if (this.isLoadingDonation) {
            this.notice = 'Gitcoins still loading... Maybe check back later?';
            this.isShowingNotice = true;
        } else {
            this.$router.push('/setup/gitcoins');
        }
    }

    toManageFootprints() {
        if (this.isLoadingFootprint) {
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
            window.location.reload();
        } else {
            this.$router.push(legacyConfig.subDomain.isSubDomainMode ? '/' : `/${rns || ethAddress}`);
        }
    }

    async save() {
        this.isLoading = true;
        const loginUser = RSS3.getLoginUser();
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
            avatar: this.profile.avatar ? [this.profile.avatar] : [],
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
        await Promise.all([RSS3.reloadLoginUser(), RSS3.reloadPageOwner()]);
        const pageOwner = RSS3.getPageOwner();
        const rns = pageOwner.name;
        const ethAddress = pageOwner.address;
        const redirectFrom = utils.getCrossDomainStorage('redirectFrom');
        utils.setCrossDomainStorage('redirectFrom', '');
        await this.$router.push(legacyConfig.subDomain.isSubDomainMode ? redirectFrom || '/' : `/${rns || ethAddress}`);
    }

    async mounted() {
        await this.initLoad();
    }
}
</script>

<style lang="postcss" scoped></style>
