<template>
    <div id="main" class="h-screen bg-gradient-to-tr from-blue-400 to-blue-200 via-blue-100 overflow-y-auto">
        <div class="m-auto pb-32 pt-8 px-4 max-w-screen-lg">
            <Header
                :ethAddress="ethAddress"
                :rns="rns"
                :rss3Profile="rss3Profile"
                title="Footprints"
                theme="footprint"
            />
            <TransBarCard
                :title="rss3Profile.name ? rss3Profile.name + `'s Footprints` : 'Footprints'"
                :haveDetails="true"
                :haveContent="false"
                :haveContentInfo="false"
            >
                <template #header>
                    <i v-if="isOwner" class="bx bxs-pencil bx-xs cursor-pointer" @click="toSetupFootprints" />
                </template>
                <template #details>
                    <div class="grid gap-4 grid-cols-1 sm:grid-cols-2">
                        <FootprintCard
                            v-for="item of footprints"
                            :key="item.id"
                            :imageUrl="item.detail.image_url"
                            :username="rss3Profile.name"
                            :activity="item.detail.name"
                            :start-date="item.detail.start_date"
                            :end-date="item.detail.end_date"
                            :location="item.detail.city || item.detail.country || 'Metaverse'"
                            type="details"
                            class="cursor-pointer"
                            @click="toSingleFootprint(item.id)"
                        />
                    </div>
                    <IntersectionObserverContainer
                        v-if="isHavingMoreAssets"
                        :once="false"
                        :enabled="!isLoadingAssets"
                        @trigger="loadMoreAssets"
                    >
                        <Button
                            size="sm"
                            class="m-auto text-primary-btn-text text-lg bg-primary-btn"
                            @click="loadMoreAssets"
                        >
                            <i v-if="isLoadingAssets" class="bx bx-loader-circle bx-spin" />
                            <i v-else class="bx bx-dots-horizontal-rounded" />
                        </Button>
                    </IntersectionObserverContainer>
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
import { debounce } from 'lodash';
import utils from '@/common/utils';
import Header from '@/components/Common/Header.vue';
import { DetailedFootprint, GeneralAsset } from '@/common/types';
import IntersectionObserverContainer from '@/components/Common/IntersectionObserverContainer.vue';
import TransBarCard from '@/components/Card/TransBarCard.vue';
import { formatter } from '@/common/address';

@Options({
    name: 'Footprints',
    components: { IntersectionObserverContainer, FootprintCard, Button, Header, TransBarCard },
})
export default class Footprints extends Vue {
    rns: string = '';
    ethAddress: string = '';
    footprints: DetailedFootprint[] = [];
    isOwner: boolean = false;
    rss3Profile: any = {};
    scrollTop: number = 0;
    lastRoute: string = '';
    assetList: GeneralAsset[] = [];
    assetsStartIndex: number = 0;
    isLoadingAssets: boolean = true;
    isHavingMoreAssets: boolean = true;
    $gtag: any;

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

        utils.subDomainModeRedirect(this.rns);

        this.rss3Profile = await pageOwner.profile;

        if (!this.rss3Profile.name) {
            this.rss3Profile.name = formatter(this.ethAddress);
        }

        const { footprints } = await utils.initAssets();
        this.assetList = footprints;
        this.isLoadingAssets = false;
        await this.loadMoreAssets();
    }

    async loadMoreAssets() {
        if (!this.isLoadingAssets) {
            this.isLoadingAssets = true;
            let endIndex = this.assetsStartIndex + config.splitPageLimits.assets;
            if (endIndex >= this.assetList.length) {
                // Not having more assets
                endIndex = this.assetList.length;
                this.isHavingMoreAssets = false;
            }
            this.footprints = this.footprints.concat(
                await utils.loadAssets(this.assetList.slice(this.assetsStartIndex, endIndex)),
            );
            this.assetsStartIndex = endIndex;
            this.isLoadingAssets = false;
        }
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
