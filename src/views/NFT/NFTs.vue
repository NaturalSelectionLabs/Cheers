<template>
    <div id="main" class="h-screen bg-nft-bg overflow-y-auto">
        <div class="m-auto pb-32 pt-8 px-4 max-w-screen-lg">
            <Header :ethAddress="ethAddress" :rns="rns" :rss3Profile="rss3Profile" title="NFTs" theme="nft" />
            <div class="grid gap-6 grid-cols-2 justify-items-center sm:grid-cols-3">
                <div class="relative w-full" v-for="item in nfts" :key="item.id">
                    <NFTItem
                        class="cursor-pointer"
                        size="auto"
                        :imageUrl="item.detail.image_url"
                        :poster-url="item.detail.image_preview_url"
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
            <IntersectionObserverContainer
                v-if="isHavingMoreAssets"
                :once="false"
                :enabled="!isLoadingAssets"
                @trigger="loadMoreAssets"
            >
                <Button
                    size="sm"
                    class="m-auto text-nft-btn-m-text text-lg bg-nft-btn-m shadow-nft-btn-m"
                    @click="loadMoreAssets"
                >
                    <i v-if="isLoadingAssets" class="bx bx-loader-circle bx-spin"></i>
                    <i v-else class="bx bx-dots-horizontal-rounded" />
                </Button>
            </IntersectionObserverContainer>
            <div
                class="fixed z-50 bottom-2 left-0 right-0 flex gap-5 m-auto px-4 py-4 w-full max-w-md bg-btn-container"
                v-if="isOwner"
            >
                <Button
                    size="lg"
                    class="m-auto text-nft-btn-m-text text-lg bg-nft-btn-m shadow-nft-btn-m"
                    @click="toSetupNfts"
                >
                    <span>Manage NFTs</span>
                </Button>
            </div>
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
import { debounce } from 'lodash';
import utils from '@/common/utils';
import Header from '@/components/Common/Header.vue';
import { DetailedNFT, GeneralAsset } from '@/common/types';
import IntersectionObserverContainer from '@/components/Common/IntersectionObserverContainer.vue';

@Options({
    name: 'NFTs',
    components: { IntersectionObserverContainer, Button, NFTItem, NFTBadges, Header },
})
export default class NFTs extends Vue {
    rns: string = '';
    ethAddress: string = '';
    isOwner: boolean = false;
    nfts: DetailedNFT[] = [];
    rss3Profile: any = {};
    $gtag: any;
    scrollTop: number = 0;
    lastRoute: string = '';
    assetList: GeneralAsset[] = [];
    assetsIndex: number = 0;
    isLoadingAssets: boolean = true;
    isHavingMoreAssets: boolean = true;

    async initLoad() {
        this.lastRoute = this.$route.fullPath;

        const addrOrName = utils.getAddress(<string>this.$route.params.address);
        const pageOwner = await RSS3.setPageOwner(addrOrName);
        this.ethAddress = pageOwner.address;
        this.rns = pageOwner.name;
        this.isOwner = RSS3.isNowOwner();

        utils.subDomainModeRedirect(this.rns);

        this.rss3Profile = pageOwner.profile;

        const { nfts } = await utils.initAssets();
        this.assetList = nfts;
        this.isLoadingAssets = false;
        await this.loadMoreAssets();
    }

    async loadMoreAssets() {
        if (!this.isLoadingAssets) {
            this.isLoadingAssets = true;
            let endIndex = this.assetsIndex + config.splitPageLimits.assets;
            if (endIndex >= this.assetList.length) {
                // Not having more assets
                endIndex = this.assetList.length;
                this.isHavingMoreAssets = false;
            }
            this.nfts = this.nfts.concat(await utils.loadAssets(this.assetList.slice(this.assetsIndex, endIndex)));
            this.assetsIndex = endIndex;
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
