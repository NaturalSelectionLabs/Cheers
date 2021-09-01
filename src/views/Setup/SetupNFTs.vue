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
                <img :src="avatar" class="rounded-full w-10 h-10 inline-block" alt="avatar" />
            </span>
        </div>
        <Card
            title="Vitrine"
            color-title="text-nft-title"
            color-tips="text-nft-title"
            color-background="bg-nft-bg"
            class="w-full mb-4"
            :is-having-content="show.length !== 0"
            :tips="show.length === 0 ? 'Add additional NFTs' : 'Drag here to show and reorder'"
        >
            <template #header-button>
                <Button size="sm" class="w-10 h-10 bg-nft-button text-white shadow-nft" @click="refresh">
                    <i class="bx bx-refresh bx-sm"></i>
                </Button>
            </template>
            <template #content>
                <draggable class="min-h-20" :list="show" group="nfts" itemKey="chain" @start="chooseAsset">
                    <template #item="{ element }">
                        <NFTItem class="shadow-nft-sm inline-flex m-0.5" :size="64" :image-url="element.image_url" />
                    </template>
                </draggable>
            </template>
            <template #footer-button>
                <Button
                    size="sm"
                    class="text-xs bg-white text-nft-button shadow-nft-sm ml-auto"
                    :class="{
                        'bg-gray-100 cursor-not-allowed': show.length === 0,
                    }"
                    :disabled="show.length === 0"
                    @click="hideAll"
                >
                    Hide All
                </Button>
            </template>
        </Card>
        <Card
            title="No-show collections"
            color-title="text-nft-title"
            color-tips="text-nft-title"
            color-background="bg-gray-bg"
            class="w-full mb-4"
            :is-having-content="hide.length !== 0"
            tips="Drag here to hide"
        >
            <template #accessibility>
                <!-- <i class="bx bx-info-circle" style="color: rgba(0, 0, 0, 0.2)" /> -->
            </template>
            <template #content>
                <details
                    v-for="(groups, gid) in hide"
                    :key="gid"
                    :open="activatedGroupID === gid"
                    @click="activatedGroupID = gid"
                >
                    <summary class="text-nft-button">{{ groups.collection_name }}</summary>
                    <draggable class="min-h-20" :list="groups.assets" group="nfts" itemKey="chain" @add="dragAddAsset">
                        <template #item="{ element }">
                            <NFTItem
                                class="shadow-nft-sm inline-flex m-0.5"
                                :size="64"
                                :image-url="element.image_url"
                            />
                        </template>
                    </draggable>
                </details>
            </template>
            <template #footer-button>
                <Button
                    size="sm"
                    class="text-xs bg-white text-nft-button shadow-nft-sm ml-auto"
                    :class="{
                        'bg-gray-100 cursor-not-allowed': hide.length === 0,
                    }"
                    :disabled="hide.length === 0"
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
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import Card from '@/components/Card.vue';
import NFTItem from '@/components/NFT/NFTItem.vue';
import { RSS3Asset } from 'rss3-next/types/rss3';
import RSS3, { IRSS3 } from '@/common/rss3';

import { DetailedNFT, RSS3AssetShow } from '@/common/types';

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
    },
})
export default class SetupNFTs extends Vue {
    avatar: String = '';
    show: RSS3AssetShow[] = [];
    hide: RSS3AssetCollectionShow[] = [];
    rss3: IRSS3 | null = null;
    activatedGroupID: Number = 0;
    isLoading: Boolean = false;

    async mounted() {
        if (!(await RSS3.reconnect())) {
            localStorage.setItem('redirectFrom', this.$route.fullPath);
            await this.$router.push('/');
        }
        this.rss3 = await RSS3.get();
        if (localStorage.getItem('profile')) {
            const profile = JSON.parse(<string>localStorage.getItem('profile'));
            this.avatar = profile.avatar;
        } else {
            const profile = await (<IRSS3>this.rss3).profile.get();
            this.avatar = profile?.avatar?.[0] || '';
        }

        // Organize NFTs
        const data = await RSS3.getAssetProfile((<IRSS3>this.rss3).account.address);
        const queriedAssets: RSS3AssetShow[] = []; // Real-time NFTs queried from asset
        for (const key in data.assets) {
            // key: ethereum / bsc / ...
            data.assets[key].forEach((account: any) => {
                account.nft?.forEach((nft: DetailedNFT) => {
                    const aNFT: RSS3AssetShow = {
                        tags: [],
                        platform: nft.chain,
                        identity: nft.asset_contract.address,
                        id: nft.token_id,
                        image_url: nft.image_url,
                        order: 0,
                    };
                    const gid = this.findGroupID(aNFT);
                    if (gid === -1) {
                        // Crete new group
                        this.hide.push({
                            collection_name: nft.collection.name,
                            contract_address: nft.asset_contract.address,
                            assets: [],
                        });
                    }
                    queriedAssets.push(aNFT);
                });
            });
        }
        const filedAssets: RSS3Asset[] = data.rss3File.assets; // NFTs cached in RSS3 file `asset`

        queriedAssets.forEach((nft: RSS3AssetShow) => {
            const i = filedAssets.findIndex(
                (fn) => nft.platform === fn.platform && nft.identity === fn.identity && nft.id === fn.id,
            );
            if (i !== -1) {
                if (!nft.tags) {
                    nft.tags = [];
                }
                nft.tags.push(...(filedAssets[i].tags || []));
                nft.tags.forEach((tag: string) => {
                    if (tag.startsWith('order:')) {
                        nft.order = parseInt(tag.substr(6), 10);
                    }
                });
                if (nft.tags.includes('hidden')) {
                    // Hidden group
                    const gid = this.findGroupID(nft);
                    this.hide[gid].assets.push(nft);
                } else {
                    // Show
                    this.show.push(nft);
                }
                filedAssets.splice(i, 1); // Remains are gone NFTs
            } else {
                // Newly added
                nft.order = -1;
                this.show.push(nft);
            }
        });

        // Sort by order

        this.show.sort((a, b) => {
            return a.order - b.order;
        });

        this.hide.forEach((group) => {
            group.assets.sort((a, b) => {
                return a.order - b.order;
            });
        });
    }

    setTaggedOrder(asset: RSS3Asset, order: number): void {
        if (!asset.tags) {
            asset.tags = [];
        } else {
            const orderPattern = /^order:(-?\d+)$/i;
            const oldIndex = asset.tags.findIndex((tag) => orderPattern.test(tag));
            if (oldIndex !== -1) {
                asset.tags.splice(oldIndex, 1);
            }
        }
        asset.tags.push(`order:${order}`);
    }

    back() {
        window.history.back();
    }

    async refresh() {}

    hideAll() {
        for (const asset of this.show) {
            this.hide[this.findGroupID(asset)].assets.push(asset);
        }
        this.show.splice(0, this.show.length);
    }
    showAll() {
        for (const group of this.hide) {
            for (const asset of group.assets) {
                this.show.push(asset);
            }
            group.assets.splice(0, group.assets.length);
        }
    }

    findGroupID(asset: RSS3AssetShow): number {
        return this.hide.findIndex((group) => group.contract_address === asset.identity);
    }

    chooseAsset(ev: any) {
        this.activatedGroupID = this.findGroupID(ev.element);
    }

    dragAddAsset(ev: any) {}

    async save() {
        this.isLoading = true;
        // Update order tag
        // Hide
        for (const group of this.hide) {
            for (const [order, asset] of group.assets.entries()) {
                if (!asset.tags) {
                    asset.tags = [];
                }
                if (!asset.tags.includes('hidden')) {
                    asset.tags.push('hidden');
                }
                const filedAsset: RSS3Asset = {
                    platform: asset.platform,
                    identity: asset.identity,
                    id: asset.id,
                    tags: [...(asset.tags || [])],
                };
                this.setTaggedOrder(filedAsset, order);
                if (asset.order !== -1) {
                    await (<IRSS3>this.rss3).assets.patchTags(filedAsset, <string[]>filedAsset.tags);
                } // todo: else: how to?
            }
        }

        // Show
        for (const [order, asset] of this.show.entries()) {
            if (!asset.tags) {
                asset.tags = [];
            }
            if (asset.tags.includes('hidden')) {
                asset.tags.splice(asset.tags.indexOf('hidden'));
            }
            const filedAsset: RSS3Asset = {
                platform: asset.platform,
                identity: asset.identity,
                id: asset.id,
                tags: [...(asset.tags || [])],
            };
            this.setTaggedOrder(filedAsset, order);
            if (asset.order !== -1) {
                await (<IRSS3>this.rss3).assets.patchTags(filedAsset, <string[]>filedAsset.tags);
            } // todo: else: how to?
        }

        await (<IRSS3>this.rss3).files.sync();
        this.isLoading = false;
        window.history.back(); // Back
    }
}
</script>

<style lang="postcss" scoped></style>
