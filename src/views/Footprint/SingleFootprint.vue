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
import { POAP, POAPResponse } from '@/common/types';
import RSS3 from '@/common/rss3';
import utils from '@/common/utils';
import FootprintDetails from '@/components/Footprint/FootprintDetails.vue';
import Header from '@/components/Common/Header.vue';
import setupTheme from '@/common/theme';

@Options({
    name: 'SingleFootprint',
    components: { Button, FootprintItem, FootprintDetails, Header },
})
export default class SingleFootprint extends Vue {
    rns: string = '';
    ethAddress: string = '';
    rss3Profile: RSS3Profile | null = {};
    details: { event: POAP; owner: string; tokenId: string } = {
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
        const addrOrName = <string>this.$route.params.address || '';
        const pageOwner = await RSS3.setPageOwner(addrOrName);
        this.ethAddress = pageOwner.address;
        this.rns = pageOwner.name;

        this.rss3Profile = await pageOwner.profile;

        const platform: string = String(this.$route.params.platform);
        const identity: string = String(this.$route.params.identity);
        const id: string = String(this.$route.params.id);

        // Setup theme
        setupTheme((await pageOwner.persona?.assets.auto.getList(pageOwner.address)) || []);

        const footprint = utils.loadAssets([
            {
                platform: platform,
                identity: identity,
                type: 'xDai.POAP',
                uniqueID: id,
            },
        ]) as unknown as POAPResponse;

        this.details.event = footprint.detail;
    }
}
</script>

<style></style>
