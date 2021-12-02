<template>
    <div class="h-screen text-body-text bg-body-bg overflow-y-auto">
        <div class="m-auto pb-32 pt-8 px-4 max-w-screen-lg">
            <Header title="Manage NFTs" theme="nft" :avatar="avatar" />
            <section class="grid gap-4 grid-cols-1 md:grid-cols-2">
                <Card
                    title="Listed"
                    color-title="text-nft-title"
                    color-tips="text-nft-title"
                    color-background="bg-nft-bg"
                    class="w-full border-nft-border"
                    :is-having-content="true"
                    :tips="displayedNFTs.length === 0 ? 'Add additional NFTs' : 'Drag here to show and reorder'"
                >
                    <template #content>
                        <draggable
                            class="min-h-20 md:h-screen-60 md:overflow-y-auto"
                            :list="displayedNFTs"
                            group="nfts"
                            @start="chooseAsset"
                            @end="nftMoveEnd"
                            data-type="displayed"
                            item-key="displayed"
                        >
                            <template #item="{ element }">
                                <NFTItem
                                    class="inline-flex m-0.5"
                                    style="cursor: grab"
                                    size="md"
                                    :image-url="element.info?.image_preview_url"
                                    :data-info="JSON.stringify(element)"
                                />
                            </template>
                        </draggable>
                    </template>
                    <template #footer-button>
                        <Button
                            size="sm"
                            class="ml-auto text-nft-btn-s-text text-xs bg-nft-btn-s shadow-nft-btn-s"
                            :class="{
                                'bg-btn-disabled cursor-not-allowed text-opacity-20': displayedNFTs.length === 0,
                            }"
                            :disabled="displayedNFTs.length === 0"
                            @click="hideAll"
                        >
                            <span>Hide All</span>
                        </Button>
                    </template>
                </Card>
                <Card
                    title="Unlisted"
                    color-title="text-nft-title"
                    color-tips="text-nft-title"
                    color-background="bg-card-hide"
                    class="w-full border-nft-border"
                    :is-having-content="true"
                    tips="Drag here to hide"
                >
                    <template #content>
                        <section class="md:h-screen-60 md:overflow-y-auto">
                            <details
                                v-for="(collection, index) in collections"
                                :key="collection"
                                :open="activatedGroupID === index"
                                @click.prevent="activatedGroupID = index"
                            >
                                <summary class="text-nft-btn-s-text">
                                    {{ collection }}
                                </summary>
                                <draggable
                                    class="min-h-20"
                                    :list="hiddenList[collection]"
                                    group="nfts"
                                    data-type="hidden"
                                    :item-key="collection"
                                    @end="nftMoveEnd"
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
                            </details>
                        </section>
                    </template>
                    <template #header-button>
                        <Button
                            size="sm"
                            class="ml-auto text-nft-btn-s-text text-xs bg-nft-btn-s shadow-nft-btn-s"
                            :class="{
                                'bg-btn-disabled cursor-not-allowed text-opacity-20': hiddenNFTs.length === 0,
                            }"
                            :disabled="hiddenNFTs.length === 0"
                            v-if="!isPCLayout"
                            @click="showAll"
                        >
                            <span>Show All</span>
                        </Button>
                    </template>
                    <template #footer-button>
                        <Button
                            size="sm"
                            class="ml-auto text-nft-btn-s-text text-xs bg-nft-btn-s shadow-nft-btn-s"
                            :class="{
                                'bg-btn-disabled cursor-not-allowed text-opacity-20': hiddenNFTs.length === 0,
                            }"
                            :disabled="hiddenNFTs.length === 0"
                            v-if="isPCLayout"
                            @click="showAll"
                        >
                            <span>Show All</span>
                        </Button>
                    </template>
                </Card>
            </section>
            <div class="fixed bottom-0 left-0 right-0 flex gap-5 m-auto px-4 py-4 w-full max-w-md bg-btn-container">
                <Button
                    size="lg"
                    class="flex-1 text-secondary-btn-text text-lg bg-secondary-btn shadow-secondary-btn"
                    @click="back"
                    ><span>Discard</span></Button
                >
                <Button
                    size="lg"
                    class="flex-1 text-primary-btn-text text-lg bg-primary-btn shadow-primary-btn"
                    @click="save"
                    ><span>Save</span></Button
                >
            </div>

            <LoadingContainer v-show="isLoading" />
        </div>
    </div>
</template>

<script lang="ts">
import { nextTick } from 'vue';
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import Card from '@/components/Card/Card.vue';
import NFTItem from '@/components/NFT/NFTItem.vue';
import RSS3, { IRSS3 } from '@/common/rss3';
import config from '@/config';

import draggable from 'vuedraggable';
import LoadingContainer from '@/components/Loading/LoadingContainer.vue';
import { GeneralAssetWithTags } from '@/common/types';
import Header from '@/components/Common/Header.vue';
import setupTheme from '@/common/theme';
import utils from '@/common/utils';
import { flattenDeep, values } from 'lodash';

@Options({
    name: 'SetupNFTs',
    components: {
        LoadingContainer,
        Button,
        Card,
        NFTItem,
        draggable,
        Header,
    },
})
export default class SetupNFTs extends Vue {
    avatar: string = config.defaultAvatar;
    rss3: IRSS3 | null = null;
    activatedGroupID: Number = 0;
    isLoading: Boolean = false;
    nfts: GeneralAssetWithTags[] = [];
    displayedNFTs: GeneralAssetWithTags[] = [];
    hiddenNFTs: GeneralAssetWithTags[] = [];
    hiddenList: {
        [collection: string]: GeneralAssetWithTags[];
    } = {};
    collections: string[] = [];
    isPCLayout: boolean = window.innerWidth > 768;

    async mounted() {
        if (!(await RSS3.reconnect())) {
            if (config.subDomain.isSubDomainMode) {
                // redirect back to root domain
                window.location.host = config.subDomain.rootDomain;
            } else {
                sessionStorage.setItem('redirectFrom', this.$route.fullPath);
                await this.$router.push('/');
            }
            return;
        }
        this.rss3 = await RSS3.get();
        if (sessionStorage.getItem('profile')) {
            const profile = JSON.parse(<string>sessionStorage.getItem('profile'));
            this.avatar = profile.avatar;
        } else {
            const profile = await (<IRSS3>this.rss3).profile.get();
            this.avatar = profile?.avatar?.[0] || config.defaultAvatar;
        }

        const assetsInRSS3File = await (<IRSS3>this.rss3).assets.get();
        const assetsGrabbed = (await RSS3.getAssetProfile((<IRSS3>this.rss3).account.address, 'NFT'))?.assets;

        // Setup theme
        setupTheme(await (<IRSS3>this.rss3).assets.get());

        if (assetsGrabbed) {
            const { listed, unlisted, assets } = await utils.initAssets(assetsInRSS3File, assetsGrabbed, 'NFT');
            this.displayedNFTs = listed;
            this.hiddenNFTs = unlisted;
            this.nfts = assets;
            const collections: {
                [key: string]: boolean;
            } = {};
            this.nfts.forEach((nft) => {
                if (nft.info.collection) {
                    collections[nft.info.collection] = true;
                }
            });
            this.collections = Object.keys(collections);
            this.collections.forEach((collection) => {
                this.hiddenList[collection] = this.hiddenNFTs.filter((nft) => nft.info.collection === collection);
            });
        }
    }

    hideAll() {
        this.displayedNFTs = [];
        this.hiddenNFTs = this.nfts;
        this.collections.forEach((collection) => {
            this.hiddenList[collection] = this.hiddenNFTs.filter((nft) => nft.info?.collection === collection);
        });
    }

    showAll() {
        this.displayedNFTs = this.nfts;
        this.hiddenNFTs = [];
        this.collections.forEach((collection) => {
            this.hiddenList[collection] = [];
        });
    }

    async chooseAsset(ev: any) {
        this.activatedGroupID = -1;
        await nextTick();
        this.activatedGroupID = this.collections.findIndex(
            (collection) => collection === JSON.parse(ev.item.dataset.info).info?.collection,
        );
    }

    async nftMoveEnd(e: any) {}

    async save() {
        this.isLoading = true;
        await utils.saveAssetsOrder(this.displayedNFTs, flattenDeep(values(this.hiddenList)));
        this.isLoading = false;
        window.history.back();
    }
}
</script>

<style lang="postcss" scoped></style>
