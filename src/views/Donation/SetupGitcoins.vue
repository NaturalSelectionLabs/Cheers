<template>
    <div class="h-screen text-body-text overflow-y-auto">
        <div class="flex flex-col m-auto pt-8 px-4 max-w-screen-lg h-full">
            <Header />

            <div class="flex flex-col flex-grow gap-4 pb-8 h-0 md:flex-row">
                <section class="flex flex-col gap-4 h-1/2 md:w-3/5 md:h-full md:overflow-y-auto">
                    <TransBarCard title="Listed" class="h-full" :have-details="true">
                        <template #details>
                            <draggable
                                class="flex-grow h-0 overflow-y-auto"
                                :list="show"
                                group="gitcoins"
                                item-key="id"
                                :animation="200"
                            >
                                <template #item="{ element }">
                                    <GitcoinItem
                                        class="inline-flex mx-0.5"
                                        style="cursor: grab"
                                        size="md"
                                        :imageUrl="element.info?.image_preview_url"
                                    />
                                </template>
                            </draggable>
                        </template>
                    </TransBarCard>
                </section>
                <section class="flex flex-col gap-4 h-1/2 md:w-2/5 md:h-full">
                    <TransBarCard title="Unlisted" class="h-full" :is-secondary="true" :have-details="true">
                        <template #details>
                            <draggable
                                class="flex-grow h-0 overflow-y-auto"
                                :list="hide"
                                group="gitcoins"
                                item-key="id"
                                :animation="200"
                            >
                                <template #item="{ element }">
                                    <GitcoinItem
                                        class="inline-flex mx-0.5"
                                        style="cursor: grab"
                                        size="md"
                                        :imageUrl="element.info?.image_preview_url"
                                    />
                                </template>
                            </draggable>
                        </template>
                    </TransBarCard>
                    <div class="flex flex-row-reverse gap-5 m-auto px-4 py-2 w-full md:flex-col">
                        <Button size="lg" class="flex-1 text-body-text text-lg bg-primary-btn" @click="save">
                            <span>Save</span>
                        </Button>
                        <Button size="lg" class="text-secondary-btn-text flex-1 text-lg bg-secondary-btn" @click="back">
                            <span>Discard</span>
                        </Button>
                    </div>
                </section>
            </div>

            <LoadingContainer v-show="isLoading" :isLooping="true" />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import draggable from 'vuedraggable';
import RSS3 from '@/common/rss3';
import legacyConfig from '@/config';
import { DetailedDonation } from '@/common/types';
import LoadingContainer from '@/components/Loading/LoadingContainer.vue';
import GitcoinItem from '@/components/Donation/GitcoinItem.vue';
import utils from '@/common/utils';
import Header from '@/components/Common/Header.vue';
import TransBarCard from '@/components/Card/TransBarCard.vue';
import config from '@/common/config';
import { utils as RSS3Utils } from 'rss3';

@Options({
    name: 'SetupGitcoins',
    components: {
        TransBarCard,
        GitcoinItem,
        LoadingContainer,
        Button,
        draggable,
        Header,
    },
})
export default class SetupGitcoins extends Vue {
    isShowLoading: Boolean = false;
    isHideLoading: Boolean = false;

    show: DetailedDonation[] = [];
    hide: DetailedDonation[] = [];
    readyAssets: DetailedDonation[] = [];

    isPCLayout: boolean = window.innerWidth > config.ui.md;

    async mounted() {
        this.isShowLoading = true;
        this.isHideLoading = true;
        await utils.tryEnsureOrRedirect(this.$route, this.$router);
        const loginUser = RSS3.getLoginUser();
        await RSS3.setPageOwner(loginUser.address);
        // Get donations
        const { donations, hiddenDonations } = await utils.initAssets();
        const showIDList = donations.map((asset) =>
            RSS3Utils.id.getAsset(asset.platform, asset.identity, asset.type, asset.uniqueID),
        );
        const hideIDList = hiddenDonations.map((asset) =>
            RSS3Utils.id.getAsset(asset.platform, asset.identity, asset.type, asset.uniqueID),
        );
        Promise.all([this.loadAssetDetails(showIDList, true), this.loadAssetDetails(hideIDList, false)]);
    }

    async loadAssetDetails(assetIDList: string[], isShow: boolean) {
        if (isShow) {
            this.show = this.sortAssets(assetIDList, await utils.loadAssetsWithNoRetry(assetIDList, false));
            this.isShowLoading = false;
        } else {
            this.hide = this.sortAssets(assetIDList, await utils.loadAssetsWithNoRetry(assetIDList, false));
            this.isHideLoading = false;
        }

        // here is the retry section
        for (let i = 0; i < 10; i++) {
            // no ready assets
            const assetsNoDetails = assetIDList.filter(
                (asset) =>
                    !(isShow ? this.show : this.hide).find((detail) => detail.id === asset)?.hasOwnProperty('info'),
            );
            if (!assetsNoDetails.length) {
                // all the assets have details, break
                break;
            } else {
                // already request but not get full details
                // sleep for two seconds
                await new Promise((r) => setTimeout(r, 2000));
            }
            this.readyAssets = this.readyAssets.concat(await utils.loadAssetsWithNoRetry(assetsNoDetails, false));
            this.updateReadyDetails();
        }
    }

    sortAssets(assetIDList: string[], assetDetailsList: DetailedDonation[]) {
        const sortedAssetDetailsList: DetailedDonation[] = [];
        assetIDList.map((assetID) => {
            const detailedAsset = assetDetailsList.find((details) => details.id === assetID);
            if (detailedAsset) {
                sortedAssetDetailsList.push(detailedAsset);
            } else {
                // placeholder for unready assets
                sortedAssetDetailsList.push({
                    id: assetID,
                });
            }
        });

        return sortedAssetDetailsList;
    }

    updateReadyDetails() {
        // update current show and hide list by using its item's ID
        const newShow: DetailedDonation[] = [];
        const newHidden: DetailedDonation[] = [];
        this.show.map((asset) => {
            const detailedAsset = this.readyAssets.find((details) => details.id === asset.id);
            newShow.push(detailedAsset || asset);
        });
        this.hide.map((asset) => {
            const detailedAsset = this.readyAssets.find((details) => details.id === asset.id);
            newHidden.push(detailedAsset || asset);
        });
        this.show = newShow;
        this.hide = newHidden;
    }

    get isLoading() {
        return this.isShowLoading || this.isHideLoading;
    }

    back() {
        const pageOwner = RSS3.getPageOwner();
        const rns = pageOwner.name;
        const ethAddress = pageOwner.address;

        if (window.history.state.back) {
            window.history.back();
        } else {
            this.$router.push((legacyConfig.subDomain.isSubDomainMode ? '' : `/${rns || ethAddress}`) + `/gitcoins`);
        }
    }

    async save() {
        this.isShowLoading = true;
        this.isHideLoading = true;
        await utils.setAssetTags(
            this.show.map((asset) => asset.id),
            this.hide.map((asset) => asset.id),
        );
        this.isShowLoading = false;
        this.isHideLoading = false;
        this.back();
    }
}
</script>

<style lang="postcss" scoped></style>
