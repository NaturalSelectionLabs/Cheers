import { Vue } from 'vue-class-component';
import { DetailedFootprint, GeneralAsset } from '@/common/types';
import { utils as RSS3Utils } from 'rss3';
import utils from '@/common/utils';

export class FootprintMixin extends Vue {
    footprints: DetailedFootprint[] = [];
    isLoadingFootprint: boolean = true;

    async ivLoadFootprint(assets: GeneralAsset[]) {
        if (assets) {
            if (assets.length === 0) {
                this.isLoadingFootprint = false;
                return;
            }
            const assetIDList = assets.map((asset) =>
                RSS3Utils.id.getAsset(asset.platform, asset.identity, asset.type, asset.uniqueID),
            );
            let displayFootprintsDetail: DetailedFootprint[] = [];
            for (let i = 0; i < 10; i++) {
                if (displayFootprintsDetail.length !== 0) {
                    this.isLoadingFootprint = false;
                }
                const assetsNoDetails = assetIDList.filter(
                    (asset) => !this.footprints.find((detail) => detail.id === asset),
                );

                if (!assetsNoDetails.length) {
                    // all the assets have details, break
                    break;
                } else if (i > 0) {
                    // already request but not get full details
                    // sleep for two seconds
                    await new Promise((r) => setTimeout(r, 2000));
                }
                console.log(`Footprint retry ${i} times`);
                displayFootprintsDetail = displayFootprintsDetail.concat(
                    await utils.loadAssetsWithNoRetry(assetsNoDetails),
                );
                this.footprints = this.sortAssets(assetIDList, displayFootprintsDetail);
            }
        }
    }

    sortAssets(assetIDList: string[], assetDetailsList: DetailedFootprint[]) {
        const sortedAssetDetailsList: DetailedFootprint[] = [];
        assetIDList.map((assetID) => {
            const detailedAsset = assetDetailsList.find((details) => details.id === assetID);
            if (detailedAsset) {
                sortedAssetDetailsList.push(detailedAsset);
            } else {
                sortedAssetDetailsList.push({
                    id: assetID,
                    detail: {
                        grant: {},
                    },
                });
            }
        });

        return sortedAssetDetailsList;
    }

    clearFootprintDetails() {
        this.footprints = [];
    }
}
