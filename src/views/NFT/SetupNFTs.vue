<template>
    <div class="h-screen text-body-text overflow-y-auto">
        <div class="flex flex-col m-auto pt-8 px-4 max-w-screen-lg h-full">
            <Header />
            <div class="flex flex-col flex-grow gap-4 pb-8 h-0 md:flex-row">
                <section class="flex flex-col gap-4 h-1/2 md:w-3/5 md:h-full md:overflow-y-auto">
                    <div v-if="!isPCLayout">
                        <TransBarCard :have-details="true">
                            <template #details>
                                <div class="flex flex-row justify-around">
                                    <SwitchButton
                                        v-for="className in allClasses"
                                        :key="className"
                                        :is-activated="className === activatedClassName"
                                        @click="setActiveClass(className)"
                                    >
                                        {{ className }}
                                    </SwitchButton>
                                </div>
                            </template>
                        </TransBarCard>
                    </div>
                    <template v-if="isPCLayout">
                        <TransBarCard
                            v-for="className in allClasses"
                            :key="className"
                            :title="className"
                            @add="dragHandler(className)"
                            :have-details="true"
                        >
                            <template #details>
                                <draggable
                                    class="min-h-16 h-full"
                                    :list="classifiedList[className]"
                                    group="nfts"
                                    item-key="id"
                                    :animation="200"
                                >
                                    <template #item="{ element }">
                                        <NFTItem
                                            class="inline-flex m-0.5"
                                            style="cursor: grab"
                                            size="md"
                                            :image-url="element.info?.image_preview_url"
                                        />
                                    </template>
                                </draggable>
                            </template>
                        </TransBarCard>
                    </template>
                    <TransBarCard v-else :title="activatedClassName" class="h-full" :have-details="true">
                        <template #details>
                            <draggable
                                class="flex-grow h-0 overflow-y-auto"
                                :list="classifiedList[activatedClassName]"
                                group="nfts"
                                item-key="id"
                                :animation="200"
                            >
                                <template #item="{ element }">
                                    <NFTItem
                                        class="inline-flex m-0.5"
                                        style="cursor: grab"
                                        size="md"
                                        :image-url="element.info?.image_preview_url"
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
                                :list="hiddenList"
                                group="nfts"
                                item-key="id"
                                :animation="200"
                            >
                                <template #item="{ element }">
                                    <NFTItem
                                        class="inline-flex m-0.5"
                                        style="cursor: grab"
                                        size="md"
                                        :image-url="element.info?.image_preview_url"
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
import NFTItem from '@/components/NFT/NFTItem.vue';
import RSS3 from '@/common/rss3';
import legacyConfig from '@/config';

import draggable from 'vuedraggable';
import LoadingContainer from '@/components/Loading/LoadingContainer.vue';
import { CustomField_PassAssets, DetailedNFT } from '@/common/types';
import Header from '@/components/Common/Header.vue';
import utils from '@/common/utils';
import TransBarCard from '@/components/Card/TransBarCard.vue';
import config from '@/common/config';
import SwitchButton from '@/components/Button/SwitchButton.vue';
import { utils as RSS3Utils } from 'rss3';
import { AnyObject } from 'rss3/types/extend';
import flattenDeep from 'lodash/flattenDeep';

@Options({
    name: 'SetupNFTs',
    components: {
        SwitchButton,
        TransBarCard,
        LoadingContainer,
        Button,
        NFTItem,
        draggable,
        Header,
    },
})
export default class SetupNFTs extends Vue {
    isShowLoading: Boolean = false;
    isHideLoading: Boolean = false;
    isPCLayout: boolean = window.innerWidth > config.ui.md;
    classifiedList: {
        [className: string]: DetailedNFT[];
    } = {
        Collectibles: [],
        Games: [],
        Awards: [],
        Organizations: [],
    };
    allClasses: string[] = Object.keys(this.classifiedList);
    activatedClassName: string = this.allClasses[0];
    hiddenList: DetailedNFT[] = [];
    readyAssets: DetailedNFT[] = [];

    async mounted() {
        this.isShowLoading = true;
        this.isHideLoading = true;
        await utils.tryEnsureOrRedirect(this.$route, this.$router);
        const loginUser = RSS3.getLoginUser();
        await RSS3.setPageOwner(loginUser.address);

        // Get NFTs
        const { nftsWithClassName, hiddenNfts } = await utils.initAssets();
        // Activate default class
        const sessionSpecifiedClassName = sessionStorage.getItem('NFTEditDefaultExpandClassName');
        if (sessionSpecifiedClassName) {
            sessionStorage.removeItem('NFTEditDefaultExpandClassName');
            this.activatedClassName = sessionSpecifiedClassName;
        }

        Promise.all([this.loadAssetDetails(nftsWithClassName, true), this.loadAssetDetails(hiddenNfts, false)]);
    }

    async loadAssetDetails(nftList: AnyObject[], isShow: boolean) {
        const assetIDList = nftList.map((asset) =>
            RSS3Utils.id.getAsset(asset.platform, asset.identity, asset.type, asset.uniqueID),
        );
        if (isShow) {
            this.classifiedList = this.sortShowAssets(nftList, []);
            this.allClasses = Object.keys(this.classifiedList);
            this.isShowLoading = false;
        } else {
            this.hiddenList = this.sortHiddenAssets(nftList, []);
            this.isHideLoading = false;
        }

        // here is the retry section
        for (let i = 0; i < 10; i++) {
            // no ready assets
            const assetsNoDetails = assetIDList.filter(
                (asset) =>
                    !(isShow ? flattenDeep(Object.values(this.classifiedList)) : this.hiddenList)
                        .find((detail) => detail.id === asset)
                        ?.hasOwnProperty('info'),
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

    sortHiddenAssets(hiddenNfts: AnyObject[], assetDetailsList: DetailedNFT[]) {
        const sortedAssetDetailsList: DetailedNFT[] = [];
        hiddenNfts.map((nft) => {
            const NFTId = RSS3Utils.id.getAsset(nft.platform, nft.identity, nft.type, nft.uniqueID);
            const detailedAsset = assetDetailsList.find((details) => details.id === NFTId);
            if (detailedAsset) {
                sortedAssetDetailsList.push(detailedAsset);
            } else {
                // placeholder for unready assets
                sortedAssetDetailsList.push({
                    id: NFTId,
                });
            }
        });
        return sortedAssetDetailsList;
    }

    sortShowAssets(nftsWithClassName: AnyObject[], assetDetailsList: DetailedNFT[]): any {
        let NFTShowList: {
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
            if (!(className in this.classifiedList)) {
                NFTShowList[className] = [];
            }
            const detailedAsset = assetDetailsList.find((dNFT) => dNFT.id === NFTId);
            if (detailedAsset) {
                NFTShowList[className].push(detailedAsset);
            } else {
                NFTShowList[className].push({
                    id: NFTId,
                });
            }
        });
        return NFTShowList;
    }

    updateReadyDetails() {
        let NFTShowList: {
            [className: string]: DetailedNFT[];
        } = {
            Collectibles: [],
            Games: [],
            Awards: [],
            Organizations: [],
        };
        let newHiddenList: DetailedNFT[] = [];

        this.allClasses.map((className) => {
            this.classifiedList[className].map((nft) => {
                const detailedAsset = this.readyAssets.find((dNFT) => dNFT.id === nft.id);
                NFTShowList[className].push(detailedAsset || nft);
            });
        });

        this.hiddenList.map((nft) => {
            const detailedAsset = this.readyAssets.find((details) => details.id === nft.id);
            newHiddenList.push(detailedAsset || nft);
        });

        this.classifiedList = NFTShowList;
        this.hiddenList = newHiddenList;
    }

    get isLoading() {
        return this.isShowLoading || this.isHideLoading;
    }

    setActiveClass(className: string) {
        this.activatedClassName = className;
    }

    dragHandler(distClassName: string) {
        this.activatedClassName = distClassName;
    }

    back() {
        const pageOwner = RSS3.getPageOwner();
        const rns = pageOwner.name;
        const ethAddress = pageOwner.address;

        if (window.history.state.back) {
            window.history.back();
        } else {
            this.$router.push((legacyConfig.subDomain.isSubDomainMode ? '' : `/${rns || ethAddress}`) + `/`);
        }
    }

    async save() {
        this.isShowLoading = true;
        this.isHideLoading = true;
        const assets: CustomField_PassAssets[] = [];

        this.allClasses.map((className) => {
            this.classifiedList[className].map((nft, index) => {
                assets.push({
                    id: nft.id,
                    class: className,
                    order: index + 1, // prevent 0 (which will not be saved)
                });
            });
        });
        this.hiddenList.map((hiddenNFT) => {
            assets.push({
                id: hiddenNFT.id,
                hide: true,
            });
        });

        await utils.updateAssetTags(assets);

        this.isShowLoading = false;
        this.isHideLoading = false;
        this.back();
    }
}
</script>

<style lang="postcss" scoped></style>
