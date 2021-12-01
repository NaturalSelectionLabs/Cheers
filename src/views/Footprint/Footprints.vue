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
                class="footprint-footprints grid grid-cols-1 divide-footprint-divider divide-y-xs sm:grid-cols-2"
                :class="{ 'pb-16': isOwner }"
            >
                <FootprintCard
                    v-for="item of footprints"
                    :key="item.platform + item.identity + item.id"
                    :imageUrl="item.info.image_preview_url"
                    :username="rss3Profile.username"
                    :activity="item.info.title"
                    :start-date="item.info.start_date"
                    :end-date="item.info.end_date"
                    :location="item.info.city || item.info.country || 'Metaverse'"
                    class="cursor-pointer"
                    @click="toSingleFootprint(item.platform, item.identity, item.id, item.type)"
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
import { GeneralAssetWithTags } from '@/common/types';
import { debounce } from 'lodash';
import utils from '@/common/utils';
import { RSS3Profile } from 'rss3-next/types/rss3';
import Header from '@/components/Common/Header.vue';
import setupTheme from '@/common/theme';

@Options({
    name: 'Footprints',
    components: { FootprintCard, Button, Header },
})
export default class Footprints extends Vue {
    rns: string = '';
    ethAddress: string = '';
    footprints: GeneralAssetWithTags[] = [];
    isOwner: boolean = false;
    rss3Profile: RSS3Profile = {};
    scrollTop: number = 0;
    lastRoute: string = '';

    async mounted() {
        this.mountScrollEvent();
    }

    async initLoad() {
        this.lastRoute = this.$route.fullPath;
        this.footprints = [];

        await RSS3.reconnect();
        const rss3 = await RSS3.visitor();
        const owner: string = <string>rss3.account.address;

        const { ethAddress, rns } = await utils.getAddress(<string>this.$route.params.address);
        this.ethAddress = ethAddress;
        this.rns = rns;
        this.isOwner = ethAddress == owner;

        this.rss3Profile = await rss3.profile.get(this.ethAddress);

        // Setup theme
        await setupTheme(await rss3.assets.get(this.ethAddress));

        const footprintsData = await RSS3.getAssetProfile(this.ethAddress, 'POAP');
        if (footprintsData) {
            const { listed } = await utils.initAssets(
                await rss3.assets.get(this.ethAddress),
                footprintsData.assets,
                'POAP',
            );
            this.footprints = listed;
        }
    }

    toSetupFootprints() {
        this.$router.push(`/setup/footprints`);
    }

    toSingleFootprint(platform: string, identity: string, id: string, type: string) {
        this.$router.push(
            (config.subDomain.isSubDomainMode ? '' : `/${this.rns || this.ethAddress}`) +
                `/singlefootprint/${platform}/${identity}/${id}/${type}`,
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
