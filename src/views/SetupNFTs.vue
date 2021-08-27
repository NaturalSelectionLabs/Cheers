<template>
    <div class="px-4 py-9 max-w-md m-auto">
        <div class="flex justify-between items-center mb-4">
            <Button size="sm" class="w-10 h-10 bg-white text-primary shadow-secondary" @click="back">
                <i class="bx bx-chevron-left bx-sm" />
            </Button>
            <span class="text-center">
                <h1 class="text-2xl text-primary font-bold inline">Manage NFTs</h1>
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
            :tips="show.length === 0 ? 'Add additional NFTs' : 'Drag to reorder'"
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
            :tips="hide.length === 0 ? 'Drag NFTs you’d like to hide here' : ''"
        >
            <template #accessibility>
                <i class="bx bx-info-circle" style="color: rgba(0, 0, 0, 0.2)" />
            </template>
            <template #content>
                <details
                    v-for="(groups, gid) in hide"
                    :key="gid"
                    :open="activatedGroupID === gid"
                    @click="activatedGroupID = gid"
                >
                    <summary>{{ groups.collection_name }}</summary>
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
            <Button size="lg" class="flex-1 text-lg bg-primary text-white shadow-primary">Save</Button>
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

interface DetailedNFT {
    chain: string;
    token_id: string;
    name: string;
    description: string | null;
    image_url: string;
    image_preview_url: string;
    image_thumbnail_url: string;
    animation_url: string | null;
    animation_original_url: string | null;
    asset_contract: {
        address: string;
        created_date: string;
        symbol: string;
    };
    collection: {
        name: string;
        description: string;
        image_url: string;
    };
    traits: {
        trait_type: string;
        value: string;
        display_type: string | null;
        max_value: string | null;
        trait_count: number;
        order: string | null;
    }[];
}

interface RSS3AssetShow extends RSS3Asset {
    image_url: string;
    order: number;
}

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

    async mounted() {
        if (!RSS3.isValidRSS3()) {
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
        const data = await RSS3.getAsset((<IRSS3>this.rss3).account.address);
        const assetsNFTs: RSS3AssetShow[] = [];
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
                    assetsNFTs.push(aNFT);
                });
            });
        }
        const filedNFTs: RSS3Asset[] = data.rss3File.assets;

        assetsNFTs.forEach((nft: RSS3AssetShow) => {
            const i = filedNFTs.findIndex(
                (fn) => nft.platform === fn.platform && nft.identity === fn.identity && nft.id === fn.id,
            );
            if (i !== -1) {
                if (!nft.tags) {
                    nft.tags = [];
                }
                nft.tags.push(...(filedNFTs[i].tags || []));
                nft.tags.forEach((tag: string) => {
                    if (tag.startsWith('order-')) {
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

    back() {
        window.history.back();
    }

    async refresh() {}

    hideAll() {
        // this.hide.push(...this.show.splice(0, this.show.length));
    }
    showAll() {
        // this.show.push(...this.hide.splice(0, this.hide.length));
    }

    findGroupID(asset: RSS3AssetShow): number {
        return this.hide.findIndex((group) => group.contract_address === asset.identity);
    }

    chooseAsset(ev: any) {
        this.activatedGroupID = this.findGroupID(ev.element);
    }

    dragChange(ev: any) {}

    dragAddAsset(ev: any) {}

    async save() {
        // Update order tag
    }
}
</script>

<style lang="postcss" scoped></style>
