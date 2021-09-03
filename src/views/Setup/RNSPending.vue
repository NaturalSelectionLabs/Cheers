<template>
    <div class="h-screen bg-pending-bg flex justify-center items-center">
        <div class="max-w-md px-4 py-9 flex flex-col justify-center items-center h-full gap-20">
            <Loading size="200" class="mb-50" />
            <div class="w-full text-left font-medium text-primary">
                <p class="text-2xl">Preparing your RNS ...</p>
                <p class="text-base">Hold on a little bit or come back later!</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Loading from '@/components/Loading.vue';
import RSS3, { IRSS3 } from '@/common/rss3';
import RNSUtils from '@/common/rns';

@Options({
    components: { Loading },
})
export default class RNSPending extends Vue {
    rss3: IRSS3 | null = null;
    rns: string = '';
    $gtag: any;

    async mounted() {
        if (!(await RSS3.reconnect())) {
            localStorage.setItem('redirectFrom', this.$route.fullPath);
            await this.$router.push('/');
        } else {
            this.rss3 = await RSS3.get();
            await this.checkAndRedirect();
            setInterval(this.checkAndRedirect, 20000);
        }
    }

    async checkAndRedirect() {
        if ((await RNSUtils.addr2Name((<IRSS3>this.rss3).account.address)).toString() !== '') {
            // Already setup RNS
            const profile = await (<IRSS3>this.rss3).profile.get();
            if (!profile) {
                // Setup Profile
                this.$gtag.event('sign_up', { userid: (<IRSS3>this.rss3).account.address });
                await this.$router.push('/setup');
            } else {
                // Login
                this.$gtag.event('login', { userid: (<IRSS3>this.rss3).account.address });
                const redirectFrom = localStorage.getItem('redirectFrom');
                localStorage.removeItem('redirectFrom');
                await this.$router.push(redirectFrom || '/home');
            }
        }
    }
}
</script>

<style lang="postcss" scoped></style>