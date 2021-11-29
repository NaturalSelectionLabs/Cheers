<template>
    <div class="h-screen bg-gitcoin-bg overflow-y-auto">
        <div class="m-auto pb-20 pt-8 px-4 max-w-screen-lg">
            <div class="header flex items-center justify-between pb-4">
                <Button
                    size="sm"
                    class="w-10 h-10 text-secondary-btn-text bg-secondary-btn shadow-secondary-btn"
                    @click="back"
                >
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
                <ImgHolder
                    class="inline-flex my-auto w-10 h-10 cursor-pointer"
                    :is-rounded="true"
                    :is-border="false"
                    :src="rss3Profile.avatar"
                    :alt="rss3Profile.username"
                    @click="toPublicPage(rns, ethAddress)"
                />
            </div>
            <section class="flex flex-col gap-y-8 m-auto max-w-screen-sm">
                <GitcoinItem :imageUrl="grant.logo || defaultAvatar" size="auto" />
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
import RNSUtils from '@/common/rns';
import RSS3 from '@/common/rss3';
import { getName } from '@/common/utils';
import GitcoinDetails from '@/components/Donation/GitcoinDetails.vue';
import { DonationInfo, GrantInfo, Profile } from '@/common/types';

@Options({
    name: 'SingleGitcoin',
    components: { ImgHolder, Button, GitcoinItem, GitcoinDetails },
})
export default class SingleGitcoin extends Vue {
    rns: string = '';
    ethAddress: string = '';
    rss3Profile: Profile = {
        avatar: config.defaultAvatar,
        username: '',
        address: '',
        bio: '',
    };

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
        await this.getAddress();

        const profile = await rss3.profile.get(this.ethAddress);
        this.rss3Profile.avatar = profile?.avatar?.[0] || config.defaultAvatar;
        this.rss3Profile.username = profile?.name || '';
        this.rss3Profile.address = this.ethAddress;

        // Setup theme
        const themes = RSS3.getAvailableThemes(await rss3.assets.get(this.ethAddress));
        if (themes[0]) {
            document.body.classList.add(themes[0].class);
        } else {
            document.body.classList.remove(...document.body.classList);
        }

        await this.loadGitcoin();
    }

    async getAddress() {
        let address: string = '';
        if (config.subDomain.isSubDomainMode) {
            // Is subdomain mode
            address = getName();
        } else if (this.$route.params.address) {
            address = <string>this.$route.params.address;
        } else {
            return false;
        }

        if (address) {
            if (address.startsWith('0x')) {
                // Might be address type
                // Get RNS and redirect
                this.ethAddress = address;
                this.rns = await RNSUtils.addr2Name(address);
                if (this.rns !== '') {
                    window.location.href =
                        'https://' +
                        this.rns +
                        '.' +
                        config.subDomain.rootDomain +
                        window.location.pathname.replace(`/${address}`, '');
                }
            } else {
                // RNS
                this.rns = address;
                this.ethAddress = (await RNSUtils.name2Addr(address)).toString();
                if (parseInt(this.ethAddress) === 0) {
                    return false;
                }
            }
        }

        return true;
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

    toPublicPage(rns: string, ethAddress: string) {
        if (rns && config.subDomain.isSubDomainMode) {
            this.$router.push('/');
        } else {
            this.$router.push(`/${rns || ethAddress}`);
        }
    }

    back() {
        if (window.history.state.back) {
            window.history.back();
        } else {
            this.$router.push(
                (config.subDomain.isSubDomainMode ? '' : `/${this.rns || this.ethAddress}`) + `/gitcoins`,
            );
        }
    }
}
</script>

<style></style>
