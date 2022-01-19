<template>
    <div class="relative flex items-center justify-between pb-4">
        <Logo v-if="displayLogo" class="w-10 h-10 cursor-pointer" />
        <div
            v-else
            class="flex items-center justify-center w-10 h-10 text-secondary-btn-text cursor-pointer"
            @click="back"
        >
            <i class="bx bx-chevron-left bx-sm" />
        </div>
        <ImgHolder
            class="inline-flex my-auto w-10 h-10 cursor-pointer"
            :is-rounded="true"
            :is-border="false"
            :src="avatar"
            :alt="rns || ethAddress || 'avatar'"
            @click="toggleDialog()"
        />
        <div
            v-if="isdisplayDialog && isLogin"
            class="
                absolute
                z-50
                bottom-0
                right-0
                flex flex-col
                gap-2
                justify-center
                p-5
                w-32
                text-primary-text
                bg-white
                rounded
                shadow-md
                transform
                translate-y-full
            "
        >
            <div class="flex flex-row gap-2 items-center cursor-pointer" @click="toPublicPage">
                <i class="bx bx-user bx-xs" />
                Home
            </div>
            <div class="flex flex-row gap-2 items-center cursor-pointer" @click="logout">
                <i class="bx bx-log-out bx-xs" />
                Logout
            </div>
        </div>
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
        displayLogo: Boolean,
    },
})
export default class Header extends Vue {
    avatar: string = config.defaultAvatar;
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

    toPublicPage() {
        if (this.rns && this.ethAddress) {
            if (this.rns && config.subDomain.isSubDomainMode) {
                window.location.href = `//${this.rns}.${config.subDomain.rootDomain}`;
            } else {
                window.location.href = `//${config.subDomain.rootDomain}/${this.ethAddress}`;
            }
        }
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
        }
    }
}
</script>

<style></style>
