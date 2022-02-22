import { Vue } from 'vue-class-component';
import { DetailedDonation, GeneralAsset } from '@/common/types';
import { utils as RSS3Utils } from 'rss3';
import utils from '@/common/utils';

export class DonationMixin extends Vue {
    isLoadingDonation: boolean = true;
    gitcoins: DetailedDonation[] = [];

    async ivLoadGitcoin(assets: GeneralAsset[]) {
        if (assets) {
            if (assets.length === 0) {
                this.isLoadingDonation = false;
                return;
            }
            const assetIDList = assets.map((asset) =>
                RSS3Utils.id.getAsset(asset.platform, asset.identity, asset.type, asset.uniqueID),
            );
            let displayedGitcoinsDetail: DetailedDonation[] = [];
            for (let i = 0; i < 10; i++) {
                if (displayedGitcoinsDetail.length !== 0) {
                    this.isLoadingDonation = false;
                }
                const assetsNoDetails = assetIDList.filter(
                    (asset) => !this.gitcoins.find((detail) => detail.id === asset),
                );

                if (!assetsNoDetails.length) {
                    // all the assets have details, break
                    break;
                } else if (i > 0) {
                    // already request but not get full details
                    // sleep for two seconds
                    await new Promise((r) => setTimeout(r, 2000));
                }
                console.log(`Donations retry ${i} times`);
                displayedGitcoinsDetail = displayedGitcoinsDetail.concat(
                    await utils.loadAssetsWithNoRetry(assetsNoDetails),
                );
                this.gitcoins = this.sortAssets(assetIDList, displayedGitcoinsDetail);
            }
        }
    }

    sortAssets(assetIDList: string[], assetDetailsList: DetailedDonation[]) {
        const sortedAssetDetailsList: DetailedDonation[] = [];
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

    clearDonationDetails() {
        this.gitcoins = [];
    }
}
