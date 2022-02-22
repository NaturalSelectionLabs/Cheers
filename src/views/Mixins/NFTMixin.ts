import { Vue } from 'vue-class-component';
import config from '@/common/config';
import { DetailedNFT, GeneralAssetWithClass } from '@/common/types';
import flattenDeep from 'lodash/flattenDeep';
import { utils as RSS3Utils } from 'rss3';
import { AnyObject } from 'rss3/types/extend';
import utils from '@/common/utils';

export class NFTMixin extends Vue {
    isLoadingNFT: boolean = true;
    classifiedList: {
        [className: string]: DetailedNFT[];
    } = {
        Collectibles: [],
    };
    allClasses: string[] = Object.keys(this.classifiedList);

    async ivLoadNFT(assets: GeneralAssetWithClass[]) {
        const nftsWithClassName = this.generateNFTsWithClassName(assets);
        const assetIDList = nftsWithClassName.map((asset) =>
            RSS3Utils.id.getAsset(asset.platform, asset.identity, asset.type, asset.uniqueID),
        );
        if (assetIDList.length === 0) {
            this.isLoadingNFT = false;
            return;
        }
        let displayedNFTsDetail: AnyObject[] = [];
        for (let i = 0; i < 10; i++) {
            if (displayedNFTsDetail.length !== 0) {
                this.isLoadingNFT = false;
            }
            const assetsNoDetails = assetIDList.filter(
                (asset) => !displayedNFTsDetail.find((detail) => detail.id === asset),
            );

            if (!assetsNoDetails.length) {
                // all the assets have details, break
                break;
            } else if (i > 0) {
                // already request but not get full details
                // sleep for two seconds
                await new Promise((r) => setTimeout(r, 2000));
            }
            console.log(`NFT retry ${i} times`);
            displayedNFTsDetail = displayedNFTsDetail.concat(await utils.loadAssetsWithNoRetry(assetsNoDetails));
            this.sortNFTDetails(nftsWithClassName, displayedNFTsDetail);
        }
    }

    generateNFTsWithClassName(assets: GeneralAssetWithClass[]) {
        // Get NFTs
        const classifiedBriefList: {
            [className: string]: GeneralAssetWithClass[];
        } = {};

        assets.map((nft) => {
            const className = nft.class || 'Collectibles';
            if (!(className in classifiedBriefList)) {
                classifiedBriefList[className] = [];
            }
            if (classifiedBriefList[className].length < config.assets.brief) {
                classifiedBriefList[className].push(nft);
            }
        });

        const nftsWithClassName = flattenDeep(Object.values(classifiedBriefList));
        return nftsWithClassName;
    }

    sortNFTDetails(nftsWithClassName: GeneralAssetWithClass[], displayedNFTsDetail: AnyObject[]) {
        const classifiedList: {
            [className: string]: DetailedNFT[];
        } = {
            Collectibles: [],
            Games: [],
            Awards: [],
            Organizations: [],
        };
        nftsWithClassName.map((nft) => {
            const className = nft.class || 'Collectibles';
            const NFTId = RSS3Utils.id.getAsset(nft.platform, nft.identity, nft.type, nft.uniqueID);
            if (!(className in classifiedList)) {
                classifiedList[className] = [];
            }
            const detailedNFT = displayedNFTsDetail.find((dNFT) => dNFT.id === NFTId);
            if (detailedNFT) {
                classifiedList[className].push(detailedNFT);
            } else {
                classifiedList[className].push({
                    id: NFTId,
                    detail: {},
                });
            }
        });
        Object.keys(classifiedList).map((listName) => {
            if (classifiedList[listName].length === 0 && listName !== 'Collectibles') {
                delete classifiedList[listName];
            }
        });

        this.classifiedList = classifiedList;
        this.allClasses = Object.keys(this.classifiedList);
    }

    clearNFTDetails() {
        this.classifiedList = {
            Collectibles: [],
        };
        this.allClasses = Object.keys(this.classifiedList);
    }
}
