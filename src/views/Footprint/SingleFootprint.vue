<template>
    <div class="h-screen bg-footprint-bg overflow-y-auto">
        <div class="m-auto pb-20 pt-8 px-4 max-w-screen-lg">
            <Header
                :ethAddress="ethAddress"
                :rns="rns"
                :rss3Profile="rss3Profile"
                title="Footprint"
                theme="footprint"
                list="footprints"
            />
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
import FootprintItem from '@/components/Footprint/FootprintItem.vue';
import { POAP } from '@/common/types';
import RSS3 from '@/common/rss3';
import utils from '@/common/utils';
import FootprintDetails from '@/components/Footprint/FootprintDetails.vue';
import { RSS3Profile } from 'rss3-next/types/rss3';
import Header from '@/components/Common/Header.vue';

@Options({
    name: 'SingleFootprint',
    components: { Button, FootprintItem, FootprintDetails, Header },
})
export default class SingleFootprint extends Vue {
    rns: string = '';
    ethAddress: string = '';
    rss3Profile: RSS3Profile = {};
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

        const { ethAddress, rns } = await utils.getAddress(<string>this.$route.params.address);
        this.ethAddress = ethAddress;
        this.rns = rns;

        this.rss3Profile = await rss3.profile.get(this.ethAddress);

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
                if (detail) {
                    this.details = detail;
                }
            }
        }
    }
}
</script>

<style></style>
