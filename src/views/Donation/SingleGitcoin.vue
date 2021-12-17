<template>
    <div class="h-screen bg-gitcoin-bg overflow-y-auto">
        <div class="m-auto pb-20 pt-8 px-4 max-w-screen-lg">
            <Header :ethAddress="ethAddress" :rns="rns" :rss3Profile="rss3Profile" list="gitcoins" />
            <section class="flex flex-col gap-y-8 m-auto max-w-screen-sm">
                <GitcoinItem :imageUrl="grant.logo" size="contain" />
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
import { DonationInfo, GitcoinResponse, GrantInfo } from '@/common/types';
import Header from '@/components/Common/Header.vue';
import setupTheme from '@/common/theme';

@Options({
    name: 'SingleGitcoin',
    components: { ImgHolder, Button, GitcoinItem, GitcoinDetails, Header },
})
export default class SingleGitcoin extends Vue {
    rns: string = '';
    ethAddress: string = '';
    rss3Profile: any = {};

    grant?: GrantInfo = {
        active: true,
        logo: config.defaultAvatar,
        slug: '...',
        reference_url: '...',
        description: '...',
    };
    donationInfo?: DonationInfo[] = [];

    async mounted() {
        const addrOrName = utils.getAddress(<string>this.$route.params.address);
        const pageOwner = await RSS3.setPageOwner(addrOrName);
        this.ethAddress = pageOwner.address;
        this.rns = pageOwner.name;

        this.rss3Profile = await pageOwner.profile;

        // Setup theme
        setupTheme((await pageOwner.persona?.assets.auto.getList(pageOwner.address)) || []);

        // const id: string = <string>this.$route.params.id;

        // const Donation = (await pageOwner.assets?.getDetails({
        //       assets: [id],
        //       full: true,
        //   })) as unknown as GitcoinResponse;
        //   console.log(id)
        // this.grant = Donation?.[0].detail.grant;
        // this.donationInfo = Donation?.[0].detail.txs;
        await this.loadGitcoin();
    }

    async loadGitcoin() {
        const platform: string = String(this.$route.params.platform);
        const identity: string = String(this.$route.params.identity);
        const id: string = String(this.$route.params.id);
        const type: string = String(this.$route.params.type);
        const Donation = (await utils.loadAssets([
            {
                platform: platform,
                identity: identity,
                type: type,
                uniqueID: id,
            },
        ])) as unknown as GitcoinResponse;
        this.grant = Donation?.[0].detail.grant;
        this.donationInfo = Donation?.[0].detail.txs;
    }

    toExternalLink(address: string) {
        window.open(address);
    }
}
</script>

<style></style>
