<template>
    <div class="px-4 py-9 max-w-md m-auto">
        <div class="flex justify-between items-center mb-4">
            <Button size="sm" class="w-10 h-10 bg-white text-primary shadow-secondary" @click="back">
                <i class="bx bx-chevron-left bx-sm" />
            </Button>
            <span class="text-center">
                <h1 class="text-xl text-primary font-bold inline">Manage NFTs</h1>
            </span>
            <span class="avatar">
                <img
                    :src="avatar"
                    class="rounded-full w-10 h-10 inline-block cursor-pointer"
                    alt="avatar"
                    @click="toPublicPage()"
                />
            </span>
        </div>
        <Card
            title="Vitrine"
            color-title="text-nft-title"
            color-tips="text-nft-title"
            color-background="bg-nft-bg"
            class="w-full mb-4"
            :is-having-content="true"
            :tips="displayedNFTs.length === 0 ? 'Add additional NFTs' : 'Drag here to show and reorder'"
        >
            <template #header-button>
                <Button
                    size="sm"
                    class="text-xs bg-white text-nft-button shadow-nft-sm ml-auto"
                    :class="{
                        'bg-gray-100 cursor-not-allowed': displayedNFTs.length === 0,
                    }"
                    :disabled="displayedNFTs.length === 0"
                    @click="hideAll"
                >
                    Hide All
                </Button>
            </template>
            <template #content>
                <draggable
                    class="min-h-20"
                    :list="displayedNFTs"
                    group="nfts"
                    @start="chooseAsset"
                    @end="nftMoveEnd"
                    data-type="displayed"
                    item-key="displayed"
                >
                    <template #item="{ element }">
                        <NFTItem
                            class="shadow-nft-sm inline-flex m-0.5"
                            :size="64"
                            :image-url="element.info?.image_url"
                            :data-info="JSON.stringify(element)"
                        />
                    </template>
                </draggable>
            </template>
            <template #footer-button> </template>
        </Card>
        <Card
            title="No-show collections"
            color-title="text-nft-title"
            color-tips="text-nft-title"
            color-background="bg-gray-bg"
            class="w-full mb-4"
            :is-having-content="true"
            tips="Drag here to hide"
        >
            <template #accessibility>
                <!-- <i class="bx bx-info-circle" style="color: rgba(0, 0, 0, 0.2)" /> -->
            </template>
            <template #content>
                <details
                    v-for="(collection, index) in collections"
                    :key="collection"
                    :open="activatedGroupID === index"
                    @click.prevent="activatedGroupID = index"
                >
                    <summary class="text-nft-button">{{ collection }}</summary>
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
                                class="shadow-nft-sm inline-flex m-0.5"
                                :size="64"
                                :image-url="element.info?.image_url"
                            />
                        </template>
                    </draggable>
                </details>
            </template>
            <template #header-button>
                <Button
                    size="sm"
                    class="text-xs bg-white text-nft-button shadow-nft-sm ml-auto"
                    :class="{
                        'bg-gray-100 cursor-not-allowed': hiddenNFTs.length === 0,
                    }"
                    :disabled="hiddenNFTs.length === 0"
                    @click="showAll"
                >
                    Show All
                </Button>
            </template>
        </Card>
        <div class="px-4 py-4 flex gap-5 fixed bottom-0 left-0 right-0 max-w-md m-auto w-full">
            <Button size="lg" class="flex-1 text-lg bg-white text-primary shadow-secondary" @click="back"
                >Discard</Button
            >
            <Button size="lg" class="flex-1 text-lg bg-primary text-white shadow-primary" @click="save">Save</Button>
        </div>
    </div>
</template>

<script lang="ts">
import { nextTick } from 'vue';
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import Card from '@/components/Card.vue';
import NFTItem from '@/components/NFT/NFTItem.vue';
import { RSS3Asset } from 'rss3-next/types/rss3';
import RSS3, { IRSS3 } from '@/common/rss3';
import config from '@/config';

import { DetailedNFT, RSS3AssetShow, RSS3AssetWithInfo } from '@/common/types';
import draggable from 'vuedraggable';

interface RSS3AssetCollectionShow {
    collection_name: string;
    contract_address: string;
    assets: RSS3AssetShow[];
}

@Options({
    components: {
        Button,
        Card,
        NFTItem,
        draggable,
    },
})
export default class SetupNFTs extends Vue {
    avatar: String = '';
    rss3: IRSS3 | null = null;
    activatedGroupID: Number = 0;
    isLoading: Boolean = false;
    nfts: any[] = [];
    displayedNFTs: RSS3AssetWithInfo[] = [];
    hiddenNFTs: RSS3AssetWithInfo[] = [];
    hiddenList: {
        [collection: string]: RSS3AssetWithInfo[];
    } = {};
    collections: string[] = [];

    async mounted() {
        if (!(await RSS3.reconnect())) {
            sessionStorage.setItem('redirectFrom', this.$route.fullPath);
            await this.$router.push('/');
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

        this.nfts = await Promise.all(
            (JSON.parse(JSON.stringify(await this.rss3?.assets.get())) || []).map(async (nft: RSS3AssetWithInfo) => {
                let info: any = await this.getInfo(nft);
                info = Object.assign(
                    {
                        collection: {
                            name: 'Others',
                        },
                    },
                    info || {},
                );
                nft.info = info;
                return nft;
            }),
        );
        this.displayedNFTs = this.nfts
            .filter((nft) => (!nft.tags || nft.tags.indexOf('pass:hidden') === -1) && nft.info)
            .sort((a, b) => this.getOrder(a) - this.getOrder(b));
        this.hiddenNFTs = this.nfts
            .filter((nft) => nft.tags && nft.tags.indexOf('pass:hidden') !== -1 && nft.info)
            .sort((a, b) => this.getOrder(a) - this.getOrder(b));
        const collections: {
            [key: string]: boolean;
        } = {};
        this.nfts.forEach((nft) => {
            if (nft.info && nft.info.collection && nft.info.collection.name) {
                collections[nft.info.collection.name] = true;
            }
        });
        this.collections = Object.keys(collections);
        this.collections.forEach((collection) => {
            this.hiddenList[collection] = this.hiddenNFTs.filter((nft) => nft.info?.collection?.name === collection);
        });
    }

    private async getInfo(nft: RSS3Asset) {
        const assets = (await RSS3.getAssetProfile((<IRSS3>this.rss3).account.address))?.assets;
        for (let chain in assets) {
            for (let i = 0; i < assets[chain].length; i++) {
                const chainInfo = assets[chain][i];
                for (let j = 0; j < chainInfo.nft.length; j++) {
                    const nftInfo = chainInfo.nft[j];
                    if (
                        nftInfo.chain === nft.platform &&
                        nftInfo.token_id === nft.id &&
                        nftInfo.asset_contract.address === nft.identity
                    ) {
                        return nftInfo;
                    }
                }
            }
        }
        return null;
    }

    private getOrder(nft: RSS3Asset) {
        let order = -1;
        nft.tags?.forEach((tag: string) => {
            if (tag.startsWith('pass:order:')) {
                order = parseInt(tag.substr(11));
            }
        });
        return order;
    }

    back() {
        window.history.back();
    }

    hideAll() {
        this.displayedNFTs = [];
        this.hiddenNFTs = this.nfts;
        this.collections.forEach((collection) => {
            this.hiddenList[collection] = this.hiddenNFTs.filter((nft) => nft.info?.collection?.name === collection);
        });
        this.sync();
    }

    showAll() {
        this.displayedNFTs = this.nfts;
        this.hiddenNFTs = [];
        this.collections.forEach((collection) => {
            this.hiddenList[collection] = [];
        });
        this.sync();
    }

    findGroupID(asset: RSS3AssetWithInfo): number {
        return this.collections.findIndex((collection) => collection === asset.info?.collection?.name);
    }

    async chooseAsset(ev: any) {
        this.activatedGroupID = -1;
        await nextTick();
        this.activatedGroupID = this.collections.findIndex(
            (collection) => collection === JSON.parse(ev.item.dataset.info).info?.collection.name,
        );
        console.log(this.activatedGroupID);
    }

    async nftMoveEnd(e: any) {
        this.sync();
    }

    sync() {
        this.displayedNFTs.forEach((nft, index) => {
            this.rss3?.assets.patchTags(
                {
                    platform: nft.platform,
                    identity: nft.identity,
                    id: nft.id,
                },
                [`pass:order:${index}`],
            );
        });
        for (const collection in this.hiddenList) {
            this.hiddenList[collection].forEach((nft, index) => {
                this.rss3?.assets.patchTags(
                    {
                        platform: nft.platform,
                        identity: nft.identity,
                        id: nft.id,
                    },
                    ['pass:hidden'],
                );
            });
        }
    }

    async save() {
        this.isLoading = true;
        await this.rss3?.files.sync();
        await RSS3.getAssetProfile((<IRSS3>this.rss3).account.address, true);
        this.isLoading = false;
        window.history.back();
    }

    public toPublicPage() {
        this.$router.push(`/${(<IRSS3>this.rss3).account.address}`);
    }
}
</script>

<style lang="postcss" scoped></style>
