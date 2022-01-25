<template>
    <div id="main" class="h-screen overflow-y-auto">
        <div class="m-auto pb-32 pt-8 px-4 max-w-screen-lg">
            <Header />
            <TransBarCard
                v-if="title === 'Vitrine'"
                :title="rss3Profile.name ? rss3Profile.name + `'s ${title}` : title"
                :haveDetails="true"
                :haveContent="false"
                :haveContentInfo="false"
            >
                <template #header>
                    <i v-if="isOwner" class="bx bx-pencil bx-xs cursor-pointer" @click="toSetupNfts" />
                </template>
                <template #details>
                    <div
                        class="grid gap-3 grid-cols-2 justify-items-center sm:grid-cols-3 md:grid-cols-4"
                        v-if="nfts.length !== 0"
                    >
                        <div class="relative w-full" v-for="item in nfts" :key="item.id">
                            <NFTItem
                                class="cursor-pointer"
                                size="auto"
                                :image-url="item.detail.animation_url || item.detail.image_preview_url || fallbackImage"
                                :poster-url="
                                    item.detail.image_preview_url ||
                                    item.detail.image_url ||
                                    item.detail.animation_url ||
                                    item.detail.animation_original_url ||
                                    fallbackImage
                                "
                                :is-showing-details="false"
                                @click="toSingleNFTPage(item.id)"
                            />
                            <NFTBadges
                                class="absolute right-2.5 top-2.5"
                                :chain="item.detail.chain"
                                location="overlay"
                                :collectionImg="item.detail.collection?.image_url"
                            />
                        </div>
                    </div>
                    <div v-else class="flex gap-2 items-start justify-center">
                        <span class="font-light">One moment! Details on the way</span>
                        <LoadingSmileContainer :isLooping="true" />
                    </div>
                    <IntersectionObserverContainer
                        v-if="isHavingMoreAssets"
                        :once="false"
                        :enabled="!isLoadingAssets"
                        @trigger="loadMoreAssets"
                    >
                        <Button size="sm" class="m-auto text-white text-lg bg-primary-btn" @click="loadMoreAssets">
                            <i v-if="isLoadingAssets" class="bx bx-loader-circle bx-spin" />
                            <i v-else class="bx bx-dots-horizontal-rounded" />
                        </Button>
                    </IntersectionObserverContainer>
                    <div v-if="!isLoadingAssets && nfts.length !== 0">
                        <div v-if="isOwner" class="flex gap-2 items-start justify-center">
                            <span class="font-light">Grab some collectibles to get a shot</span>
                            <Smile :size="18" />
                        </div>
                        <div v-else>
                            <span class="font-light"
                                >Looks like this user hasn't got a shot. Come back and check it out later</span
                            >
                            <Smile :size="18" />
                        </div>
                    </div>
                </template>
            </TransBarCard>
            <TransBarCard
                v-else
                :title="rss3Profile.name ? rss3Profile.name + `'s ${title}` : title"
                :haveDetails="true"
                :haveContent="false"
                :haveContentInfo="false"
            >
                <template #header>
                    <i v-if="isOwner" class="bx bx-pencil bx-xs cursor-pointer" @click="toSetupNfts" />
                </template>
                <template #details>
                    <div class="grid gap-3 grid-cols-1 justify-items-center md:grid-cols-2" v-if="nfts.length !== 0">
                        <AssetCard
                            v-for="item in nfts"
                            :key="item.id"
                            :image-url="item.detail.animation_url || item.detail.image_preview_url || defaultAvatar"
                            size="xl"
                            :type="title"
                            :name="item.detail.name"
                            :username="rss3Profile.name"
                            @click="toSingleNFTPage(item.id)"
                        />
                    </div>
                    <div v-else class="flex gap-2 items-start justify-center">
                        <span class="font-light">One moment! Details on the way</span>
                        <Smile :size="18" />
                    </div>
                    <IntersectionObserverContainer
                        v-if="isHavingMoreAssets"
                        :once="false"
                        :enabled="!isLoadingAssets"
                        @trigger="loadMoreAssets"
                    >
                        <Button size="sm" class="m-auto text-white text-lg bg-primary-btn" @click="loadMoreAssets">
                            <i v-if="isLoadingAssets" class="bx bx-loader-circle bx-spin" />
                            <i v-else class="bx bx-dots-horizontal-rounded" />
                        </Button>
                    </IntersectionObserverContainer>
                    <div v-if="!isLoadingAssets && nfts.length === 0">
                        <div v-if="isOwner" class="flex gap-2 items-start justify-center">
                            <span class="font-light">Grab some collectibles to get a shot</span>
                            <Smile :size="18" />
                        </div>
                        <div v-else>
                            <span class="font-light"
                                >Looks like this user hasn't got a shot. Come back and check it out later</span
                            >
                            <Smile :size="18" />
                        </div>
                    </div>
                </template>
            </TransBarCard>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import NFTItem from '@/components/NFT/NFTItem.vue';
import NFTBadges from '@/components/NFT/NFTBadges.vue';
import RSS3 from '@/common/rss3';
import { utils as RSS3Utils } from 'rss3';
import legacyConfig from '@/config';
import config from '@/common/config';
import { debounce, filter } from 'lodash';
import utils from '@/common/utils';
import Header from '@/components/Common/Header.vue';
import { DetailedNFT, GeneralAssetWithClass } from '@/common/types';
import IntersectionObserverContainer from '@/components/Common/IntersectionObserverContainer.vue';
import TransBarCard from '@/components/Card/TransBarCard.vue';
import { formatter } from '@/common/address';
import AssetCard from '@/components/Card/AssetCard.vue';
import Smile from '@/components/Icons/Smile.vue';
import LoadingSmileContainer from '@/components/Loading/LoadingSmileContainer.vue';

@Options({
    name: 'NFTs',
    components: {
        IntersectionObserverContainer,
        Button,
        NFTItem,
        NFTBadges,
        Header,
        TransBarCard,
        AssetCard,
        Smile,
        LoadingSmileContainer,
    },
})
export default class NFTs extends Vue {
    title: string = '';
    rns: string = '';
    ethAddress: string = '';
    isOwner: boolean = false;
    nfts: DetailedNFT[] = [];
    rss3Profile: any = {};
    $gtag: any;
    scrollTop: number = 0;
    lastRoute: string = '';
    assetList: GeneralAssetWithClass[] = [];
    assetsStartIndex: number = 0;
    isLoadingAssets: boolean = true;
    isHavingMoreAssets: boolean = true;
    fallbackImage: string = config.undefinedImageAlt;

    async initLoad() {
        this.lastRoute = this.$route.fullPath;
        let type = String(this.$route.params.type);
        this.title = type.replace(type[0], type[0].toUpperCase());

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

        const { nftsWithClassName } = await utils.initAssets();
        this.assetList = nftsWithClassName.filter((element) => (element.class || 'Vitrine') === this.title);
        this.isLoadingAssets = false;
        this.nfts = [];
        this.assetsStartIndex = 0;
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
            const nftDetailsList = await utils.loadAssets(this.assetList.slice(this.assetsStartIndex, endIndex));
            this.assetList.map((nft) => {
                const detailedNFT = nftDetailsList.find(
                    (dNFT) => dNFT.id === RSS3Utils.id.getAsset(nft.platform, nft.identity, nft.type, nft.uniqueID),
                );
                if (detailedNFT) {
                    this.nfts.push(detailedNFT);
                }
            });
            this.assetsStartIndex = endIndex;
            this.isLoadingAssets = false;
        }
    }

    toSingleNFTPage(id: string) {
        const { platform, identity, type, uniqueID } = RSS3Utils.id.parseAsset(id);
        this.$gtag.event('visitSingleNft', {
            userid: this.rns || this.ethAddress,
            platform,
            identity,
            uniqueID,
            type,
        });
        this.$router.push(
            (legacyConfig.subDomain.isSubDomainMode ? '' : `/${this.rns || this.ethAddress}`) +
                `/singlenft/${platform}/${identity}/${uniqueID}/${type}`,
        );
    }

    toSetupNfts() {
        sessionStorage.setItem('NFTEditDefaultExpandClassName', this.title);
        this.$router.push(`/setup/nfts`);
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
