<template>
    <div class="m-auto pb-20 pt-8 px-4 max-w-screen-lg">
        <Header list="footprints" />
        <div class="p-5 bg-card-bg rounded-xl md:py-12">
            <section class="m-auto max-w-screen-sm">
                <FootprintItem :imageUrl="details.image_url" size="auto" />
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

@Options({
    name: 'SingleFootprint',
    components: { Button, FootprintItem, FootprintDetails, Header },
})
export default class SingleFootprint extends Vue {
    details: POAP = {
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
    };

    async mounted() {
        const addrOrName = utils.getAddress(<string>this.$route.params.address);
        const pageOwner = await RSS3.setPageOwner(addrOrName);

        utils.subDomainModeRedirect(pageOwner.name);
        const platform: string = String(this.$route.params.platform);
        const identity: string = String(this.$route.params.identity);
        const id: string = String(this.$route.params.id);
        const type: string = String(this.$route.params.type);

        const footprint = (await utils.loadAssets([
            {
                platform: platform,
                identity: identity,
                type: type,
                uniqueID: id,
            },
        ])) as unknown as POAPResponse;
        this.details = footprint?.[0].detail;
    }
}
</script>

<style></style>
