<template>
    <div class="flex items-center justify-center h-screen bg-gradient-to-tr from-blue-400 to-blue-200 via-blue-100">
        <div class="flex flex-col gap-20 items-center justify-center px-4 py-9 max-w-md h-full">
            <Loading :size="200" class="mb-50" />
            <div class="w-full text-left text-primary-text font-medium">
                <p class="text-2xl">Preparing your Pass ...</p>
                <p class="text-base">Hold on a little bit or come back later!</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Loading from '@/components/Loading/Loading.vue';
import RSS3 from '@/common/rss3';
import RNSUtils from '@/common/rns';
import config from '@/config';

@Options({
    name: 'RNSPending',
    components: { Loading },
})
export default class RNSPending extends Vue {
    rns: string = '';
    loadingIntervalID: ReturnType<typeof setTimeout> | null = null;
    $gtag: any;

    async mounted() {
        if (!RSS3.isValidRSS3()) {
            sessionStorage.setItem('redirectFrom', this.$route.fullPath);
            await this.$router.push('/');
        } else {
            const loginUser = RSS3.getLoginUser();
            this.loadingIntervalID = setInterval(async () => {
                const address = loginUser.address;
                const rns = await RNSUtils.addr2Name(address);
                if (rns !== '') {
                    // Already setup RNS
                    if (this.loadingIntervalID) {
                        clearInterval(this.loadingIntervalID);
                        this.loadingIntervalID = null;
                    }
                    const profile = loginUser.profile;
                    if (!(profile?.name || profile?.bio || profile?.avatar)) {
                        // Setup Profile
                        await loginUser.persona?.files.sync();
                        this.$gtag.event('sign_up', { userid: loginUser.address });
                        await this.$router.push('/setup');
                    } else {
                        // Login
                        this.$gtag.event('login', { userid: loginUser.address });
                        const redirectFrom = sessionStorage.getItem('redirectFrom');
                        sessionStorage.removeItem('redirectFrom');
                        if (rns) {
                            window.location.href =
                                '//' + rns + '.' + config.subDomain.rootDomain + (redirectFrom || '');
                        } else {
                            await this.$router.push(redirectFrom || `/${rns || address}`);
                        }
                    }
                }
            }, 10000);
        }
    }
}
</script>

<style lang="postcss" scoped></style>
