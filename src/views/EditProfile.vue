<template>
    <div class="h-screen bg-body-bg text-body-text overflow-y-auto">
        <div class="px-4 py-9 max-w-screen-lg m-auto pb-20">
            <div class="text-center mb-4 relative">
                <Button
                    size="sm"
                    class="w-10 h-10 bg-secondary-btn text-secondary-btn-text shadow-secondary-btn"
                    @click="back"
                >
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
                <h1 class="text-xl text-primary-text font-bold absolute top-0 leading-10 w-full text-center -z-10">
                    Edit Profile
                </h1>
            </div>
            <section class="max-w-md m-auto">
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

                <div class="px-4 py-4 flex gap-5 fixed left-0 right-0 max-w-md m-auto w-full">
                    <Button
                        size="lg"
                        class="flex-1 text-lg bg-secondary-btn text-secondary-btn-text shadow-secondary-btn"
                        @click="back"
                        ><span>Discard</span></Button
                    >
                    <Button
                        size="lg"
                        class="flex-1 text-lg bg-primary-btn text-primary-btn-text shadow-primary-btn"
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
                            class="w-72 bg-primary-btn text-primary-btn-text shadow-primary-btn"
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
import LinkButton from '@/components/LinkButton.vue';
import RNSUtils from '@/common/rns';

@Options({
    name: 'EditProfile',
    components: {
        LinkButton,
        Modal,
        Button,
        AvatarEditor,
        Card,
        AccountItem,
        NFTItem,
        Input,
        Loading,
        LoadingContainer,
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
    rss3: IRSS3 | null = null;
    isLoading: Boolean = false;
    maxValueLength: Number = 280;
    notice: String = '';
    isShowingNotice: Boolean = false;
    ethAddress: string = '';
    rns: string = '';

    $gtag: any;

    async mounted() {
        if (!(await RSS3.reconnect())) {
            sessionStorage.setItem('redirectFrom', this.$route.fullPath);
            await this.$router.push('/');
        } else {
            this.rss3 = await RSS3.get();
            this.ethAddress = await (<IRSS3>this.rss3).account.address;
            this.rns = (await RNSUtils.addr2Name(this.ethAddress)).replace(config.rns.suffix, '');
        }

        const profile = await (<IRSS3>this.rss3).profile.get();

        this.profile.avatar = profile?.avatar?.[0] || config.defaultAvatar;
        this.profile.name = profile?.name || '';
        if (profile?.bio) {
            const fieldPattern = /<([A-Z]+?)#(.+?)?>/gi;
            const fields = profile.bio.match(fieldPattern) || [];
            this.profile.bio = profile.bio.replace(fieldPattern, '');

            for (const field of fields) {
                const splits = fieldPattern.exec(field) || [];
                switch (splits[1]) {
                    case 'SITE':
                        this.profile.link = splits[2];
                        break;
                    default:
                        // Do nothing
                        break;
                }
            }
        }

        // Setup theme
        const themes = RSS3.getAvailableThemes(await (<IRSS3>this.rss3).assets.get());
        if (themes[0]) {
            document.body.classList.add(themes[0].class);
        } else {
            document.body.classList.remove(...document.body.classList);
        }
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

    setOversizeNotice(field: string) {
        this.notice = `${field} cannot be longer than ${this.maxValueLength} chars`;
        this.isLoading = false;
        this.isShowingNotice = true;
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
            this.setOversizeNotice('Name');
            return;
        }
        if (this.profile.bio?.length + this.profile.link?.length + 8 > this.maxValueLength) {
            this.setOversizeNotice('Bio');
            return;
        }
        const newProfile: RSS3Profile = {
            name: this.profile.name,
            bio: this.profile.bio + (this.profile.link ? `<SITE#${this.profile.link}>` : ''),
        };

        // Upload avatar
        const avatarUrl = await (<any>this.$refs.avatar).upload();
        if (avatarUrl) {
            newProfile.avatar = [avatarUrl];
        }
        await (<IRSS3>this.rss3).profile.patch(newProfile);

        // Save
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
        await this.$router.push(
            config.subDomain.isSubDomainMode ? redirectFrom || '/' : `/${this.rns || this.ethAddress}`,
        );
    }

    async isPassEnough(): Promise<boolean> {
        const passBalance = await RNSUtils.balanceOfPass3((<IRSS3>this.rss3).account.address);
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
                sessionStorage.setItem('redirectFrom', this.$route.fullPath);
                await this.$router.push('/rns');
            }
        }
    }
}
</script>

<style lang="postcss" scoped></style>
