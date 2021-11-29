<template>
    <div class="h-screen bg-footprint-bg overflow-y-auto">
        <div class="m-auto pb-20 pt-8 px-4 max-w-screen-lg">
            <div class="header flex items-center justify-between pb-4">
                <Button
                    size="sm"
                    class="w-10 h-10 text-secondary-btn-text bg-secondary-btn shadow-secondary-btn"
                    @click="back"
                >
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
                <div class="text-center text-footprint-title text-xl font-bold">Footprints</div>
                <ImgHolder
                    class="inline-flex my-auto w-10 h-10 cursor-pointer"
                    :is-rounded="true"
                    :is-border="false"
                    :src="rss3Profile.avatar"
                />
            </div>
            <section class="m-auto max-w-screen-sm">
                <FootprintItem class="mb-4" :imageUrl="details.event.image_url" size="auto" />
                <FootprintDetails :details="details" />
            </section>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import ImgHolder from '@/components/Common/ImgHolder.vue';
import FootprintItem from '@/components/Footprint/FootprintItem.vue';
import { POAP, Profile } from '@/common/types';
import RSS3 from '@/common/rss3';
import config from '@/config';
import RNSUtils from '@/common/rns';
import { getName } from '@/common/utils';
import FootprintDetails from '@/components/Footprint/FootprintDetails.vue';

@Options({
    name: 'SingleFootprint',
    components: { ImgHolder, Button, FootprintItem, FootprintDetails },
})
export default class SingleFootprint extends Vue {
    rns: string = '';
    ethAddress: string = '';
    rss3Profile: Profile = {
        avatar: config.defaultAvatar,
        username: '',
        address: '',
        bio: '',
    };
    details: POAP = {
        event: {
            id: 0,
            fancy_id: '',
            country: '',
            city: '',
            description: '',
            year: 1970,
            start_date: '',
            end_date: '',
            expiry_date: '',
            name: '',
            image_url: '',
            event_url: '',
            supply: 0,
        },
        owner: '',
        tokenId: '',
    };

    async mounted() {
        await RSS3.reconnect();
        const rss3 = await RSS3.visitor();
        await this.getAddress();

        const profile = await rss3.profile.get(this.ethAddress);
        this.rss3Profile.avatar = profile?.avatar?.[0] || config.defaultAvatar;
        this.rss3Profile.username = profile?.name || '';
        this.rss3Profile.address = this.ethAddress;

        const platform: string = String(this.$route.params.platform);
        const identity: string = String(this.$route.params.identity);
        const id: string = String(this.$route.params.id);

        // Setup theme
        const themes = RSS3.getAvailableThemes(await rss3.assets.get(this.ethAddress));
        if (themes[0]) {
            document.body.classList.add(themes[0].class);
        } else {
            document.body.classList.remove(...document.body.classList);
        }

        const footprintData = await RSS3.getAssetProfile(this.ethAddress, 'POAP');

        if (footprintData) {
            const asset = footprintData.assets.find(
                (ag) => ag.platform === platform && ag.identity === identity && ag.id === id,
            );
            if (asset) {
                const detail = (await RSS3.getFootprintDetail(this.ethAddress, platform, identity, id))?.data;
                console.log(detail);
                if (detail) {
                    this.details = detail;
                }
            }
        }
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

    back() {
        if (window.history.state.back) {
            window.history.back();
        } else {
            this.$router.push(
                (config.subDomain.isSubDomainMode ? '' : `/${this.rns || this.ethAddress}`) + `/footprints`,
            );
        }
    }
}
</script>

<style></style>
