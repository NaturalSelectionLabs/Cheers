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
                            :animation="200"
                        >
                            <template #item="{ element }">
                                <NFTItem
                                    class="inline-flex m-0.5"
                                    style="cursor: grab"
                                    size="md"
                                    :image-url="element.detail.image_preview_url"
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
                                    :animation="200"
                                >
                                    <template #item="{ element }">
                                        <NFTItem
                                            class="inline-flex m-0.5"
                                            style="cursor: grab"
                                            size="md"
                                            :image-url="element.detail.image_preview_url"
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
                                'bg-btn-disabled cursor-not-allowed text-opacity-20': isNothingHidden,
                            }"
                            :disabled="isNothingHidden"
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
                                'bg-btn-disabled cursor-not-allowed text-opacity-20': isNothingHidden,
                            }"
                            :disabled="isNothingHidden"
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
                >
                    <span>Save</span>
                </Button>
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
import RSS3 from '@/common/rss3';
import config from '@/config';

import draggable from 'vuedraggable';
import LoadingContainer from '@/components/Loading/LoadingContainer.vue';
import { DetailedNFT } from '@/common/types';
import Header from '@/components/Common/Header.vue';
import utils from '@/common/utils';

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
    activatedGroupID: Number = 0;
    isLoading: Boolean = false;
    displayedNFTs: DetailedNFT[] = [];
    hiddenList: {
        [collection: string]: DetailedNFT[];
    } = {};
    collections: string[] = [];
    isPCLayout: boolean = window.innerWidth > 768;

    get isNothingHidden() {
        for (const collection of this.collections) {
            if (this.hiddenList[collection].length > 0) {
                return false;
            }
        }
        return true;
    }

    async mounted() {
        const loginUser = await RSS3.getLoginUser();
        await RSS3.setPageOwner(loginUser.address);
        const profile = loginUser.profile;
        this.avatar = profile?.avatar?.[0] || config.defaultAvatar;

        // Get NFTs
        const { nfts, hiddenNfts } = await utils.initAssets();

        this.displayedNFTs = await utils.loadAssets(nfts);
        const hiddenNFTs = await utils.loadAssets(hiddenNfts);
        this.displayedNFTs.forEach((nft) => {
            if (nft.detail.collection?.name) {
                this.collections.push(nft.detail.collection.name);
            }
        });
        hiddenNFTs.forEach((nft) => {
            if (nft.detail.collection?.name) {
                this.collections.push(nft.detail.collection.name);
            }
        });
        this.collections.push('Others');
        this.collections.forEach((collection) => {
            this.hiddenList[collection] = hiddenNFTs.filter((nft) => nft.detail.collection?.name === collection);
        });
        this.hiddenList['Others'] = hiddenNFTs.filter((nft) => !nft.detail.collection?.name);
    }

    hideAll() {
        this.displayedNFTs.forEach((nft) => {
            if (nft.detail.collection?.name) {
                this.hiddenList[nft.detail.collection?.name].push(nft);
            } else {
                this.hiddenList['Others'].push(nft);
            }
        });
        this.displayedNFTs = [];
    }

    showAll() {
        this.collections.forEach((collection) => {
            this.displayedNFTs.push(...this.hiddenList[collection]);
            this.hiddenList[collection] = [];
        });
    }

    async chooseAsset(ev: any) {
        this.activatedGroupID = -1;
        await nextTick();
        const gid = this.collections.findIndex(
            (collection) => collection === JSON.parse(ev.item.dataset.info).detail.collection?.name,
        );
        this.activatedGroupID = gid === -1 ? this.collections.indexOf('Others') : gid;
    }

    async nftMoveEnd(e: any) {}

    async save() {
        this.isLoading = true;
        const listed = this.displayedNFTs.map((nft) => nft.id);
        const unlisted: RSS3AutoAsset[] = [];
        for (const collection of this.collections) {
            unlisted.push(...this.hiddenList[collection].map((nft) => nft.id));
        }
        await utils.setAssetTags(listed, unlisted);
        this.isLoading = false;
        window.history.back();
    }

    back() {
        window.history.back();
    }
}
</script>

<style lang="postcss" scoped></style>
