<template>
    <div class="h-screen bg-gitcoin-bg overflow-y-auto">
        <div class="m-auto pb-20 pt-8 px-4 max-w-screen-lg">
            <Header :ethAddress="ethAddress" :rns="rns" :rss3Profile="rss3Profile" list="gitcoins" />
            <section class="flex flex-col gap-y-8 m-auto max-w-screen-sm">
                <GitcoinItem :imageUrl="grant.logo" size="auto" />
                <GitcoinDetails :details="grant" :donationInfo="donationInfo" />
            </section>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import ImgHolder from '@/components/Common/ImgHolder.vue';
import GitcoinItem from '@/components/Donation/GitcoinItem.vue';
import config from '@/config';
import RSS3 from '@/common/rss3';
import utils from '@/common/utils';
import GitcoinDetails from '@/components/Donation/GitcoinDetails.vue';
import { DonationInfo, GrantInfo } from '@/common/types';
import { RSS3Profile } from 'rss3-next/types/rss3';
import Header from '@/components/Common/Header.vue';
import setupTheme from '@/common/theme';

@Options({
    name: 'SingleGitcoin',
    components: { ImgHolder, Button, GitcoinItem, GitcoinDetails, Header },
})
export default class SingleGitcoin extends Vue {
    rns: string = '';
    ethAddress: string = '';
    rss3Profile: RSS3Profile = {};

    grant?: GrantInfo = {
        active: true,
        logo: config.defaultAvatar,
        slug: '...',
        reference_url: '...',
        description: '...',
    };
    donationInfo?: DonationInfo[] = [];

    async mounted() {
        await RSS3.reconnect();
        const rss3 = await RSS3.visitor();

        const { ethAddress, rns } = await utils.getAddress(<string>this.$route.params.address);
        this.ethAddress = ethAddress;
        this.rns = rns;

        this.rss3Profile = await rss3.profile.get(this.ethAddress);

        // Setup theme
        await setupTheme(await rss3.assets.get(this.ethAddress));

        await this.loadGitcoin();
    }

    async loadGitcoin() {
        const platform: string = <string>this.$route.params.platform;
        const identity: string = <string>this.$route.params.identity;
        const id: string = <string>this.$route.params.id;

        const res = await RSS3.getGitcoinDonation(this.ethAddress, platform, identity, id);
        if (res) {
            this.grant = res.data.grant;
            this.donationInfo = res.data.txs.sort((a, b) => {
                return parseInt(b.timeStamp) - parseInt(a.timeStamp);
            });
        }
    }

    toExternalLink(address: string) {
        window.open(address);
    }
}
</script>

<style></style>
