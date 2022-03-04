<template>
    <div class="relative flex items-center justify-between pb-4 text-body-text">
        <Logo v-if="displayLogo" class="cursor-pointer" @click="toHomePage" :size="55" />
        <div v-else class="flex h-10 w-10 cursor-pointer items-center justify-center" @click="back">
            <i class="bx bx-chevron-left bx-sm" />
        </div>
        <h1 v-if="title" class="text-2xl font-bold">{{ title }}</h1>
        <ImgHolder
            v-if="isLogin"
            class="my-auto inline-flex h-10 w-10 cursor-pointer"
            :is-rounded="true"
            :is-border="false"
            :src="avatar || defaultAvatar"
            :alt="rns || ethAddress || ''"
            @click="toggleDialog()"
        />
        <Button v-else size="sm" class="w-32 bg-primary-btn text-body-text" @click="toHomePage"> Connect </Button>
        <transition name="fade">
            <template v-if="isdisplayDialog">
                <div
                    class="absolute bottom-0 right-0 z-50 -my-2 mx-2 flex w-32 translate-y-full transform flex-col justify-center gap-2 rounded bg-white p-5 shadow-md"
                >
                    <div class="flex cursor-pointer flex-row items-center gap-2" @click="toPublicPage">
                        <i class="bx bx-user bx-xs text-btn-icon" />
                        Home
                    </div>
                    <div class="flex cursor-pointer flex-row items-center gap-2" @click="logout">
                        <i class="bx bx-log-out bx-xs text-btn-icon" />
                        Logout
                    </div>
                    <div class="flex cursor-pointer flex-row items-center gap-2" @click="toPrivacy">
                        <i class="bx bx-lock bx-xs text-btn-icon" />
                        Privacy
                    </div>
                </div>
            </template>
        </transition>
        <div
            v-if="isdisplayDialog && isLogin"
            class="fixed left-0 top-0 z-10 m-0 h-screen w-screen p-0"
            @click="toggleDialog()"
        />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import ImgHolder from '@/components/Common/ImgHolder.vue';
import Logo from '@/components/Icons/Logo.vue';
import RSS3 from '@/common/rss3';
import config from '@/config';

@Options({
    name: 'Header',
    components: { ImgHolder, Button, Logo },
    props: {
        list: String,
        title: String,
        displayLogo: Boolean,
    },
})
export default class Header extends Vue {
    defaultAvatar: string = config.defaultAvatar;
    avatar?: string;
    isLogin: boolean = false;
    ethAddress: string = '';
    rns: string = '';
    list!: string | undefined;
    displayLogo!: boolean;
    isdisplayDialog: boolean = false;

    async mounted() {
        if (RSS3.isValidRSS3()) {
            const rss3Profile = (await RSS3.ensureLoginUser()) as any;
            this.rns = rss3Profile.name;
            this.ethAddress = rss3Profile.address;
            this.avatar = rss3Profile?.profile?.avatar?.[0];
            this.isLogin = true;

            if (this.avatar === config.oldDefaultAvatar) {
                this.avatar = this.defaultAvatar;
                const loginUserPersona = RSS3.getLoginUser().persona;
                // remove the old default avatar
                const newProfile: RSS3Profile = {
                    avatar: [],
                    name: rss3Profile?.profile?.name,
                    bio: rss3Profile?.profile?.bio,
                };
                await loginUserPersona?.profile.patch(newProfile);
                // Save
                try {
                    await loginUserPersona?.files.sync();
                } catch (e) {
                    console.log(e);
                    return;
                }
            }
        }
    }

    toggleDialog() {
        this.isdisplayDialog = !this.isdisplayDialog;
    }

    back() {
        if (window.history.state.back) {
            window.history.back();
        } else {
            if (this.list) {
                this.$router.push(
                    (config.subDomain.isSubDomainMode ? '' : `/${this.rns || this.ethAddress}`) + `/${this.list}`,
                );
            } else {
                this.$router.push(config.subDomain.isSubDomainMode ? '/' : `/${this.rns || this.ethAddress}`);
            }
        }
    }

    toHomePage() {
        window.location.href = '//' + config.subDomain.rootDomain;
    }

    toPublicPage() {
        if (this.rns) {
            window.location.href = `//${this.rns}.${config.subDomain.rootDomain}`;
        } else {
            window.location.href = `//${config.subDomain.rootDomain}/${this.ethAddress}`;
        }
    }

    toPrivacy() {
        window.location.href = 'https://rss3.io/#/privacy';
    }

    async logout() {
        if (confirm('Are you sure to logout?')) {
            (<HTMLLinkElement>document.getElementById('favicon')).href = '/favicon.ico';
            document.title = 'Cheers Bio';

            await RSS3.disconnect();
            if (config.subDomain.isSubDomainMode) {
                window.location.href = '//' + config.subDomain.rootDomain;
            } else {
                await this.$router.push('/');
            }
        }
    }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
