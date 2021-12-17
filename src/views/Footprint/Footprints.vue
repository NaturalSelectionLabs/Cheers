<template>
    <div id="main" class="h-screen bg-footprint-bg overflow-y-auto">
        <div class="m-auto pb-32 pt-8 px-4 max-w-screen-lg">
            <Header
                :ethAddress="ethAddress"
                :rns="rns"
                :rss3Profile="rss3Profile"
                title="Footprints"
                theme="footprint"
            />
            <div
                class="grid grid-cols-1 divide-footprint-divider divide-y-xs sm:grid-cols-2"
                :class="{ 'pb-16': isOwner }"
            >
                <FootprintCard
                    v-for="item of footprints"
                    :key="item.id"
                    :imageUrl="item.detail.image_url"
                    :username="rss3Profile.name"
                    :activity="item.detail.name"
                    :start-date="item.detail.start_date"
                    :end-date="item.detail.end_date"
                    :location="item.detail.city || item.detail.country || 'Metaverse'"
                    class="cursor-pointer"
                    @click="toSingleFootprint(item.id)"
                />
            </div>
            <div
                class="fixed bottom-2 left-0 right-0 flex gap-5 m-auto px-4 py-4 w-full max-w-md bg-btn-container"
                v-if="isOwner"
            >
                <Button
                    size="lg"
                    class="m-auto text-footprint-btn-m-text text-lg bg-footprint-btn-m shadow-footprint-btn-m"
                    @click="toSetupFootprints"
                >
                    <span>Manage Footprints</span>
                </Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import FootprintCard from '@/components/Footprint/FootprintCard.vue';
import config from '@/config';
import RSS3 from '@/common/rss3';
import { utils as RSS3Utils } from 'rss3';
import { debounce } from 'lodash';
import utils from '@/common/utils';
import Header from '@/components/Common/Header.vue';
import setupTheme from '@/common/theme';
import { DetailedFootprint } from '@/common/types';

@Options({
    name: 'Footprints',
    components: { FootprintCard, Button, Header },
})
export default class Footprints extends Vue {
    rns: string = '';
    ethAddress: string = '';
    footprints: DetailedFootprint[] = [];
    isOwner: boolean = false;
    rss3Profile: any = {};
    scrollTop: number = 0;
    lastRoute: string = '';

    async mounted() {
        this.mountScrollEvent();
    }

    async initLoad() {
        this.lastRoute = this.$route.fullPath;
        this.footprints = [];

        const addrOrName = utils.getAddress(<string>this.$route.params.address);
        const pageOwner = await RSS3.setPageOwner(addrOrName);
        this.ethAddress = pageOwner.address;
        this.rns = pageOwner.name;
        this.isOwner = RSS3.isNowOwner();

        this.rss3Profile = await pageOwner.profile;

        const { footprints } = await utils.initAssets();
        this.footprints = await utils.loadAssets(footprints);
    }

    toSetupFootprints() {
        this.$router.push(`/setup/footprints`);
    }

    toSingleFootprint(id: string) {
        const { platform, identity, type, uniqueID } = RSS3Utils.id.parseAsset(id);
        this.$router.push(
            (config.subDomain.isSubDomainMode ? '' : `/${this.rns || this.ethAddress}`) +
                `/singlefootprint/${platform}/${identity}/${uniqueID}/${type}`,
        );
    }

    mountScrollEvent() {
        const el = document.getElementById('main');
        if (el) {
            el.addEventListener(
                'scroll',
                debounce((ev) => {
                    this.scrollTop = el.scrollTop;
                }, 100),
            );
        }
    }

    activated() {
        if (this.lastRoute === this.$route.fullPath) {
            const el = document.getElementById('main');
            if (el) {
                el.scrollTop = this.scrollTop;
            }
        } else {
            this.initLoad();
        }
    }
}
</script>

<style></style>
