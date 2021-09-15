<template>
    <div class="h-screen bg-pending-bg flex justify-center items-center">
        <div class="max-w-md px-4 py-9 flex flex-col justify-center items-center h-full gap-10">
            <div class="w-full text-left font-medium text-primary-text">
                <p class="text-2xl">Continue to set up your RNS <span class="font-bold">on PC 💻</span></p>
            </div>
            <div class="w-full text-left font-medium text-primary-text">
                <p class="text-base">Don't have access to PC right now? Check our docs below and set up later!</p>
            </div>
            <Button size="lg" class="w-full text-lg bg-secondary-btn text-secondary-btn-text shadow-secondary-button">
                <span>About RNS</span>
            </Button>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Loading from '@/components/Loading.vue';
import Button from '@/components/Button.vue';
import RSS3, { IRSS3 } from '@/common/rss3';
import RNSUtils from '@/common/rns';

@Options({
    components: { Loading, Button },
})
export default class GoToPC extends Vue {
    rss3: IRSS3 | null = null;
    rns: string = '';
    $gtag: any;

    async mounted() {
        if (!(await RSS3.reconnect())) {
            sessionStorage.setItem('redirectFrom', this.$route.fullPath);
            await this.$router.push('/');
        } else {
            this.rss3 = await RSS3.get();
            await this.checkAndRedirect();
            setInterval(this.checkAndRedirect, 20000);
        }
    }

    async checkAndRedirect() {
        if ((await RNSUtils.addr2Name((<IRSS3>this.rss3).account.address)) !== '') {
            // Already setup RNS
            const profile = await (<IRSS3>this.rss3).profile.get();
            if (!profile) {
                // Setup Profile
                await (<IRSS3>this.rss3).files.sync();
                this.$gtag.event('sign_up', { userid: (<IRSS3>this.rss3).account.address });
                await this.$router.push('/setup');
            } else {
                // Login
                this.$gtag.event('login', { userid: (<IRSS3>this.rss3).account.address });
                const redirectFrom = sessionStorage.getItem('redirectFrom');
                sessionStorage.removeItem('redirectFrom');
                await this.$router.push(redirectFrom || '/home');
            }
        }
    }
}
</script>

<style lang="postcss" scoped></style>
