<template>
    <div class="h-screen text-body-text bg-body-bg overflow-y-auto">
        <div class="m-auto pb-20 px-4 py-9 max-w-screen-lg">
            <div class="relative mb-4 text-center">
                <Button
                    size="sm"
                    class="w-10 h-10 text-secondary-btn-text bg-secondary-btn shadow-secondary-btn"
                    @click="back"
                >
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
                <h1 class="absolute -z-10 top-0 w-full text-center text-primary-text text-xl font-bold leading-10">
                    Edit Profile
                </h1>
            </div>
            <section class="m-auto max-w-md">
                <AvatarEditor class="m-auto mb-4" size="lg" :url="profile.avatar" ref="avatar" />
                <LinkButton
                    class="m-auto mb-4"
                    :class="{
                        'cursor-default': rns,
                    }"
                    @click="toSetupRNS"
                >
                    <span>{{ rns ? rns : 'Claim Your RNS' }}</span>
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

                <BarCard color="account" class="mb-4 w-full">
                    <template #content>
                        <div
                            class="inline-block mr-1 cursor-pointer"
                            v-for="item in accounts"
                            :key="item.platform + item.identity"
                        >
                            <EVMpAccountItem v-if="item.platform === 'EVM+'" :size="40" :address="item.identity" />
                            <AccountItem v-else :size="40" :chain="item.platform" :address="item.identity" />
                        </div>
                    </template>
                    <template #footer>
                        <section class="flex flex-row gap-2">
                            <Button
                                size="sm"
                                class="w-8 h-8 text-account-btn-s-text bg-account-btn-s shadow-account-btn-s"
                                @click="toManageAccounts"
                            >
                                <i class="bx bxs-pencil bx-xs" />
                            </Button>
                            <Button
                                size="sm"
                                class="w-8 h-8 text-account-btn-s-text bg-account-btn-s shadow-account-btn-s"
                                @click="toAccountsPage"
                            >
                                <i class="bx bx-expand-alt bx-xs" />
                            </Button>
                        </section>
                    </template>
                </BarCard>

                <div class="fixed bottom-4 left-0 right-0 flex gap-5 m-auto px-4 py-4 w-full max-w-md">
                    <Button
                        size="lg"
                        class="flex-1 text-secondary-btn-text text-lg bg-secondary-btn shadow-secondary-btn"
                        @click="back"
                        ><span>Discard</span></Button
                    >
                    <Button
                        size="lg"
                        class="flex-1 text-primary-btn-text text-lg bg-primary-btn shadow-primary-btn"
                        @click="save"
                        ><span>Save</span></Button
                    >
                </div>
            </section>

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
                            class="w-72 text-primary-btn-text bg-primary-btn shadow-primary-btn"
                            @click="isShowingNotice = false"
                        >
                            <span>OK</span>
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
import BarCard from '@/components/Card/BarCard.vue';
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
        BarCard,
    },
})
export default class EditProfile extends Vue {
    profile: {
        avatar: string;
        name: string;
        bio: string;
        link: string;
    } = {
        avatar: config.defaultAvatar,
        name: '',
        bio: '',
        link: '',
    };
    isLoading: Boolean = false;
    maxValueLength: Number = 280;
    notice: String = '';
    isShowingNotice: Boolean = false;
    ethAddress: string = '';
    rns: string = '';
    $gtag: any;
    accounts: {
        platform: string;
        identity: string;
    }[] = [];

    async mounted() {
        await utils.tryEnsureOrRedirect(this.$route, this.$router);

        const loginUser = RSS3.getLoginUser();
        await RSS3.setPageOwner(loginUser.address);
        this.ethAddress = loginUser.address;
        this.rns = loginUser.name;

        const profile = loginUser.profile;

        this.profile.avatar = profile?.avatar?.[0] || config.defaultAvatar;
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
            avatar: [this.profile.avatar],
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
        const redirectFrom = sessionStorage.getItem('redirectFrom');
        sessionStorage.removeItem('redirectFrom');
        await this.$router.push(
            config.subDomain.isSubDomainMode ? redirectFrom || '/' : `/${this.rns || this.ethAddress}`,
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
            // if (!(await this.isPassEnough())) {
            //     this.notice =
            //         'Oops! You haven’t got any $PASS yet. Setup your RNS later in your profile when you get one!';
            //     this.isLoading = false;
            //     this.isShowingNotice = true;
            // } else {
            //     // this.saveEdited();
            //     sessionStorage.setItem('redirectFrom', this.$route.fullPath);
            //     await this.$router.push('/rns');
            // }
            this.notice =
                "Oops! We're currently updating our website. Please visit revery.so to continue claiming your RNS. Sorry for the inconvenience.";
            this.isLoading = false;
            this.isShowingNotice = true;
        }
    }

    toManageAccounts() {
        this.$router.push('/setup/accounts');
    }

    toAccountsPage() {
        this.$gtag.event('visitAccountsPage', { userid: this.rns || this.ethAddress });
        this.$router.push(config.subDomain.isSubDomainMode ? '' : `/${this.rns || this.ethAddress}`);
    }

    activated() {
        this.startLoadingAccounts();
    }
}
</script>

<style lang="postcss" scoped></style>
