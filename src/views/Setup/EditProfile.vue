<template>
    <div class="m-auto pb-20 px-4 py-9 max-w-screen-lg text-body-text">
        <div class="flex items-center justify-between mb-10 w-full text-center">
            <i class="bx bx-chevron-left bx-sm text-secondary-btn-text w-10 h-10 cursor-pointer" @click="back"></i>
            <div class="flex flex-grow justify-center mr-10">
                <h1 class="text-2xl font-bold">Edit Profile</h1>
            </div>
        </div>
        <section class="m-auto max-w-md">
            <AvatarEditor class="m-auto mb-4" size="lg" :url="profile.avatar || defaultAvatar" ref="avatar" />
            <LinkButton
                class="m-auto mb-4"
                :class="{
                    'cursor-default': rns,
                }"
                @click="toSetupRNS"
            >
                <span class="px-4 py-1">{{ rns ? rns : 'Claim Your RNS' }}</span>
            </LinkButton>
            <Input class="mb-4 w-full" :is-single-line="true" placeholder="Username" v-model="profile.name" />
            <Input
                class="mb-4 w-full"
                :is-single-line="true"
                placeholder="Personal link"
                prefix="https://"
                v-model="profile.link"
            />
            <Input class="mb-4 w-full" :is-single-line="false" placeholder="Bio" v-model="profile.bio" />

            <div class="fixed left-0 right-0 flex gap-5 m-auto px-4 w-full max-w-md md:px-0">
                <Button
                    size="sm"
                    class="text-secondary-btn-text flex-1 h-9 text-base bg-secondary-btn opacity-80"
                    @click="handleDiscard()"
                    ><span>Discard</span></Button
                >
                <Button size="sm" class="flex-1 h-9 text-body-text text-base bg-primary-btn opacity-80" @click="save"
                    ><span>Save</span></Button
                >
            </div>
        </section>

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
                <div v-if="!isSavingNotice" class="flex flex-row gap-5">
                    <Button size="sm" class="w-72 text-body-text bg-primary-btn" @click="isShowingNotice = false">
                        <span>OK</span>
                    </Button>
                </div>
                <div v-else class="flex flex-row gap-5 w-full">
                    <Button
                        size="sm"
                        class="w-33 text-body-text bg-secondary-btn"
                        @click="
                            () => {
                                isShowingNotice = false;
                                isSavingNotice = false;
                            }
                        "
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button
                        size="sm"
                        class="w-33 text-body-text bg-primary-btn"
                        @click="
                            () => {
                                back();
                                isShowingNotice = false;
                                isSavingNotice = false;
                            }
                        "
                    >
                        <span>OK</span>
                    </Button>
                </div>
            </template>
        </Modal>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import AvatarEditor from '@/components/Profile/AvatarEditor.vue';
import EVMpAccountItem from '@/components/Account/EVMpAccountItem.vue';
import AccountItem from '@/components/Account/AccountItem.vue';
import Input from '@/components/Input/Input.vue';
import Modal from '@/components/Common/Modal.vue';
import Loading from '@/components/Loading/Loading.vue';
import LoadingContainer from '@/components/Loading/LoadingContainer.vue';
import RSS3 from '@/common/rss3';
import { utils as RSS3Utils } from 'rss3';
import config from '@/config';
import LinkButton from '@/components/Button/LinkButton.vue';
import RNSUtils from '@/common/rns';
import TransBarCard from '@/components/Card/TransBarCard.vue';
import utils from '@/common/utils';

@Options({
    name: 'EditProfile',
    components: {
        EVMpAccountItem,
        LinkButton,
        Modal,
        Button,
        AvatarEditor,
        AccountItem,
        Input,
        Loading,
        LoadingContainer,
        TransBarCard,
    },
})
export default class EditProfile extends Vue {
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
    isLoading: Boolean = false;
    maxValueLength: Number = 280;
    notice: String = '';
    isShowingNotice: Boolean = false;
    ethAddress: string = '';
    web3name: string = '';
    rns: string = '';
    $gtag: any;
    accounts: {
        platform: string;
        identity: string;
    }[] = [];
    isSaved: Boolean = false;
    isSavingNotice: Boolean = false;
    defaultAvatar: string = config.defaultAvatar;

    async mounted() {
        await utils.tryEnsureOrRedirect(this.$route, this.$router);
        this.loadUserData();
    }

    async updated() {
        const loginUser = RSS3.getLoginUser();
        const userChanged = this.ethAddress !== loginUser.address;
        if (userChanged) {
            this.clearProfileData();
            this.loadUserData();
        }
    }

    handleDiscard() {
        if (!this.isSaved) {
            this.isSavingNotice = true;
            this.isShowingNotice = true;
            this.notice = 'Your edit will be discarded. Are you sure to go back?';
        }
    }

    clearProfileData() {
        this.profile = {
            name: '',
            bio: '',
            link: '',
        };
        this.ethAddress = '';
        this.accounts = [];
    }

    async loadUserData() {
        const loginUser = RSS3.getLoginUser();
        await RSS3.setPageOwner(loginUser.address);
        this.ethAddress = loginUser.address;
        this.web3name = loginUser.name;
        this.rns = await RNSUtils.addr2Name(loginUser.address, true);

        const profile = loginUser.profile;

        this.profile.avatar = profile?.avatar?.[0];
        this.profile.name = profile?.name || '';
        if (profile?.bio) {
            // Profile
            const { extracted, fieldsMatch } = utils.extractEmbedFields(profile?.bio || '', ['SITE']);
            this.profile.bio = extracted;
            this.profile.link = fieldsMatch?.['SITE'] || '';
        }
        this.startLoadingAccounts();
    }

    startLoadingAccounts() {
        if (this.ethAddress) {
            this.accounts = [];
            setTimeout(async () => {
                const { listed } = await utils.initAccounts();
                const accountList = listed.map((account) => RSS3Utils.id.parseAccount(account.id));
                this.accounts = [
                    {
                        platform: 'EVM+',
                        identity: this.ethAddress,
                    },
                ].concat(accountList);
            }, 0);
        }
    }

    setOversizeNotice(field: string) {
        this.notice = `${field} cannot be longer than ${this.maxValueLength} chars`;
        this.isLoading = false;
        this.isShowingNotice = true;
    }

    back() {
        const pageOwner = RSS3.getPageOwner();
        const rns = pageOwner.name;
        const ethAddress = pageOwner.address;

        if (window.history.state.back) {
            window.history.back();
        } else {
            this.$router.push((config.subDomain.isSubDomainMode ? '' : `/${rns || ethAddress}`) + `/nfts`);
        }
    }

    async save() {
        this.isLoading = true;
        if (this.profile.name.length > this.maxValueLength) {
            this.setOversizeNotice('Name');
            return;
        }
        if (this.profile.bio?.length + this.profile.link?.length + 8 > this.maxValueLength) {
            this.setOversizeNotice('Bio');
            return;
        }

        const loginUserPersona = RSS3.getLoginUser().persona;
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
        await loginUserPersona?.profile.patch(newProfile);

        // Save
        try {
            await loginUserPersona?.files.sync();
        } catch (e) {
            console.log(e);
            this.isLoading = false;
            return;
        }
        // this.clearEdited();
        this.$gtag.event('finishEditProfile', { userid: RSS3.getLoginUser().address });
        this.isLoading = false;
        await RSS3.reloadLoginUser();
        await RSS3.reloadPageOwner();
        const redirectFrom = utils.getCrossDomainStorage('redirectFrom');
        utils.setCrossDomainStorage('redirectFrom', '');
        await this.$router.push(
            config.subDomain.isSubDomainMode ? redirectFrom || '/' : `/${this.web3name || this.ethAddress}`,
        );
    }

    async isPassEnough(): Promise<boolean> {
        const passBalance = await RNSUtils.balanceOfPass3(RSS3.getLoginUser().address);
        console.log('Your $PASS: ', passBalance);
        return passBalance >= 1;
    }

    async toSetupRNS() {
        if (!this.rns) {
            this.isLoading = true;
            if (!(await this.isPassEnough())) {
                this.notice =
                    'Oops! You haven’t got any $PASS yet. Setup your RNS later in your profile when you get one!';
                this.isLoading = false;
                this.isShowingNotice = true;
            } else {
                // this.saveEdited();
                utils.setCrossDomainStorage('redirectFrom', this.$route.fullPath);
                await this.$router.push('/rns');
            }
        }
    }

    toManageAccounts() {
        this.$router.push('/setup/accounts');
    }

    toAccountsPage() {
        this.$gtag.event('visitAccountsPage', { userid: this.web3name || this.ethAddress });
        this.$router.push(config.subDomain.isSubDomainMode ? '' : `/${this.web3name || this.ethAddress}`);
    }

    activated() {
        this.startLoadingAccounts();
    }
}
</script>

<style lang="postcss" scoped></style>
