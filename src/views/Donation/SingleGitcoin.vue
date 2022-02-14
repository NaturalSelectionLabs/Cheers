<template>
    <div class="m-auto pb-20 pt-8 px-4 max-w-screen-lg">
        <Header list="gitcoins" />
        <div class="p-5 bg-white bg-opacity-50 rounded-xl md:py-12">
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
import RSS3 from '@/common/rss3';
import utils from '@/common/utils';
import GitcoinDetails from '@/components/Donation/GitcoinDetails.vue';
import { DonationInfo, GitcoinResponse, GrantInfo } from '@/common/types';
import Header from '@/components/Common/Header.vue';

@Options({
    name: 'SingleGitcoin',
    components: { ImgHolder, Button, GitcoinItem, GitcoinDetails, Header },
})
export default class SingleGitcoin extends Vue {
    rns: string = '';
    ethAddress: string = '';
    grant: GrantInfo = {
        active: true,
        logo: '',
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

        utils.subDomainModeRedirect(this.rns);
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
