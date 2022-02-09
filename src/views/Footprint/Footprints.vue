<template>
    <div id="main" class="h-screen overflow-y-auto">
        <div class="m-auto pb-32 pt-8 px-4 max-w-screen-lg">
            <Header />
            <TransBarCard
                :title="rss3Profile.name ? rss3Profile.name + `'s Footprints` : 'Footprints'"
                :haveDetails="true"
                :haveContent="false"
                :haveContentInfo="false"
            >
                <template #header>
                    <i v-if="isOwner" class="bx bx-pencil bx-xs cursor-pointer" @click="toSetupFootprints" />
                </template>
                <template #details>
                    <div class="grid gap-4 grid-cols-1 sm:grid-cols-2" v-if="sortedFootprints.length !== 0">
                        <FootprintCard
                            v-for="item of sortedFootprints"
                            :key="item.id"
                            :imageUrl="item.detail.image_url"
                            :username="rss3Profile.name"
                            :activity="item.detail.name"
                            :start-date="item.detail.start_date"
                            :end-date="item.detail.end_date"
                            :location="item.detail.city || item.detail.country || 'Metaverse'"
                            type="details"
                            @click="toSingleFootprint(item.id)"
                        />
                    </div>
                    <IntersectionObserverContainer
                        v-if="isHavingMoreAssets"
                        :once="false"
                        :enabled="!isLoadingAssets"
                        @trigger="loadMoreAssets"
                    >
                        <div class="flex gap-2 items-start justify-center">
                            <span class="font-light">One moment </span>
                            <LoadingSmile :size="18" :isLooping="true" />
                        </div>
                    </IntersectionObserverContainer>
                    <div
                        v-if="!isLoadingAssets && sortedFootprints.length === 0"
                        class="flex flex-row gap-2 items-end justify-center"
                    >
                        <span v-if="isOwner" class="font-light">Attend some events to get a shot</span>
                        <span v-else class="font-light">
                            Looks like this user hasn't got a shot.<br />
                            Come back and check it out later
                        </span>
                        <Smile :size="18" class="mb-1" />
                    </div>
                </template>
            </TransBarCard>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import FootprintCard from '@/components/Footprint/FootprintCard.vue';
import legacyConfig from '@/config';
import config from '@/common/config';
import RSS3 from '@/common/rss3';
import { utils as RSS3Utils } from 'rss3';
import debounce from 'lodash/debounce';
import utils from '@/common/utils';
import Header from '@/components/Common/Header.vue';
import { DetailedFootprint } from '@/common/types';
import IntersectionObserverContainer from '@/components/Common/IntersectionObserverContainer.vue';
import TransBarCard from '@/components/Card/TransBarCard.vue';
import { formatter } from '@/common/address';
import Smile from '@/components/Icons/Smile.vue';
import LoadingSmile from '@/components/Loading/LoadingSmile.vue';

@Options({
    name: 'Footprints',
    components: {
        IntersectionObserverContainer,
        FootprintCard,
        Button,
        Header,
        TransBarCard,
        Smile,
        LoadingSmile,
    },
})
export default class Footprints extends Vue {
    rns: string = '';
    ethAddress: string = '';
    footprints: DetailedFootprint[] = [];
    sortedFootprints: DetailedFootprint[] = [];
    isOwner: boolean = false;
    rss3Profile: any = {};
    scrollTop: number = 0;
    lastRoute: string = '';
    assetIDList: string[] = [];
    assetsStartIndex: number = 0;
    isLoadingAssets: boolean = true;
    isHavingMoreAssets: boolean = true;
    $gtag: any;

    async mounted() {
        this.mountScrollEvent();
    }

    async initLoad() {
        this.lastRoute = this.$route.fullPath;

        const addrOrName = utils.getAddress(<string>this.$route.params.address);
        const pageOwner = await RSS3.setPageOwner(addrOrName);
        this.ethAddress = pageOwner.address;
        this.rns = pageOwner.name;
        this.isOwner = RSS3.isNowOwner();

        utils.subDomainModeRedirect(this.rns);

        this.rss3Profile = pageOwner.profile;

        if (!this.rss3Profile.name) {
            this.rss3Profile.name = formatter(this.ethAddress);
        }

        const { footprints } = await utils.initAssets();
        this.assetIDList = footprints.map((asset) =>
            RSS3Utils.id.getAsset(asset.platform, asset.identity, asset.type, asset.uniqueID),
        );
        this.assetsStartIndex = 0;
        this.isLoadingAssets = false;
        this.footprints = [];
        this.sortedFootprints = [];
        await this.loadMoreAssets();
    }

    async loadMoreAssets() {
        if (!this.isLoadingAssets) {
            this.isLoadingAssets = true;
            let endIndex = this.assetsStartIndex + config.splitPageLimits.assets;
            if (endIndex >= this.assetIDList.length) {
                // Not having more assets
                endIndex = this.assetIDList.length;
                this.isHavingMoreAssets = false;
            }
            const requestList = this.assetIDList.slice(this.assetsStartIndex, endIndex);
            this.footprints = this.footprints.concat(await utils.loadAssetsWithNoRetry(requestList));
            this.sortedFootprints = this.sortAssets();
            this.assetsStartIndex = endIndex;
            this.isLoadingAssets = false;
            for (let i = 0; i < 10; i++) {
                const assetsNoDetails = requestList.filter(
                    (asset) => !this.footprints.find((detail) => detail.id === asset),
                );
                if (!assetsNoDetails.length) {
                    // all the assets have details, break
                    break;
                } else {
                    // already request but not get full details
                    // sleep for two seconds
                    await new Promise((r) => setTimeout(r, 2000));
                }
                this.footprints = this.footprints.concat(await utils.loadAssetsWithNoRetry(requestList));
                this.sortedFootprints = this.sortAssets();
            }
        }
    }

    sortAssets() {
        const sortedAssetDetailList: DetailedFootprint[] = [];
        this.assetIDList.map((assetID) => {
            const detailedAsset = this.footprints.find((details) => details.id === assetID);
            if (detailedAsset) {
                sortedAssetDetailList.push(detailedAsset);
            }
        });

        return sortedAssetDetailList;
    }

    toSetupFootprints() {
        this.$router.push(`/setup/footprints`);
    }

    toSingleFootprint(id: string) {
        const { platform, identity, type, uniqueID } = RSS3Utils.id.parseAsset(id);
        this.$gtag.event('visitSingleFootprint', {
            userid: this.rns || this.ethAddress,
            platform,
            identity,
            uniqueID,
            type,
        });
        this.$router.push(
            (legacyConfig.subDomain.isSubDomainMode ? '' : `/${this.rns || this.ethAddress}`) +
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
