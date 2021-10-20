<template>
    <div class="h-screen bg-body-bg text-body-text overflow-y-auto">
        <div class="px-4 pt-8 pb-32 max-w-screen-lg m-auto">
            <div class="flex justify-between items-center mb-4">
                <Button
                    size="sm"
                    class="
                        w-10
                        h-10
                        bg-secondary-btn
                        text-secondary-btn-text
                        shadow-secondary-btn
                        border-secondary-btn-border
                    "
                    @click="back"
                >
                    <i class="bx bx-chevron-left bx-sm" />
                </Button>
                <span class="text-center">
                    <h1 class="text-xl text-footprint-title font-bold inline">Manage Footprints</h1>
                </span>
                <span class="avatar">
                    <ImgHolder
                        class="w-10 h-10 inline-flex my-auto cursor-pointer"
                        :is-rounded="true"
                        :is-border="false"
                        :src="avatar"
                        @click="back"
                    />
                </span>
            </div>
            <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card
                    title="Listed"
                    color-title="text-footprint-title"
                    color-tips="text-footprint-title"
                    color-background="bg-footprint-bg"
                    class="w-full"
                    :is-having-content="true"
                    tips="Drag to reorder"
                >
                    <template #content>
                        <draggable
                            class="min-h-20 md:h-screen-60 md:overflow-y-auto"
                            :list="show"
                            group="footprints"
                            data-type="displayed"
                            item-key="displayed"
                        >
                            <template #item="{ element }">
                                <FootprintItem
                                    class="inline-flex mx-0.5"
                                    style="cursor: grab"
                                    :size="70"
                                    :imageUrl="element.info.image_preview_url"
                                />
                            </template>
                        </draggable>
                    </template>
                    <template #footer-button>
                        <Button
                            size="sm"
                            class="text-xs bg-footprint-btn-s text-footprint-btn-s-text shadow-footprint-btn-s"
                            :class="{
                                'bg-gray-100 cursor-not-allowed': show.length === 0,
                            }"
                            :disabled="show.length === 0"
                            @click="hideAll"
                        >
                            <span>Hide All</span>
                        </Button>
                    </template>
                </Card>
                <Card
                    title="Unlisted"
                    color-title="text-footprint-title"
                    color-tips="text-footprint-title"
                    color-background="bg-card-hide"
                    class="w-full"
                    :is-having-content="true"
                    tips="Drag here to hide"
                >
                    <template #header-button>
                        <Button
                            size="sm"
                            class="text-xs bg-footprint-btn-s text-footprint-btn-s-text shadow-footprint-btn-s"
                            :class="{
                                'bg-gray-100 cursor-not-allowed': hide.length === 0,
                            }"
                            v-if="!isPCLayout"
                            :disabled="hide.length === 0"
                            @click="showAll"
                        >
                            <span>Show All</span>
                        </Button>
                    </template>
                    <template #content>
                        <draggable
                            class="min-h-20 md:h-screen-60 md:overflow-y-auto"
                            :list="hide"
                            group="footprints"
                            data-type="displayed"
                            item-key="displayed"
                        >
                            <template #item="{ element }">
                                <FootprintItem
                                    class="inline-flex mx-0.5"
                                    style="cursor: grab"
                                    :size="70"
                                    :imageUrl="element.info.image_preview_url"
                                />
                            </template>
                        </draggable>
                    </template>
                    <template #footer-button>
                        <Button
                            size="sm"
                            class="text-xs bg-footprint-btn-s text-footprint-btn-s-text shadow-footprint-btn-s"
                            :class="{
                                'bg-gray-100 cursor-not-allowed': hide.length === 0,
                            }"
                            v-if="isPCLayout"
                            :disabled="hide.length === 0"
                            @click="showAll"
                        >
                            <span>Show All</span>
                        </Button>
                    </template>
                </Card>
            </section>
            <div class="px-4 py-4 flex gap-5 fixed bottom-0 left-0 right-0 max-w-md m-auto w-full bg-btn-container">
                <Button
                    size="lg"
                    class="flex-1 text-lg bg-secondary-btn text-secondary-btn-text shadow-secondary-btn"
                    @click="back"
                    ><span>Discard</span></Button
                >
                <Button
                    size="lg"
                    class="flex-1 text-lg bg-primary-btn text-primary-btn-text shadow-primary-btn"
                    @click="save"
                    ><span>Save</span></Button
                >
            </div>

            <LoadingContainer v-show="isLoading" />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import Card from '@/components/Card.vue';
import draggable from 'vuedraggable';
import ImgHolder from '@/components/ImgHolder.vue';
import RSS3, { IRSS3 } from '@/common/rss3';
import config from '@/config';
import { GeneralAsset, GeneralAssetWithTags } from '@/common/types';
import LoadingContainer from '@/components/LoadingContainer.vue';
import { RSS3Account, RSS3Asset } from 'rss3-next/types/rss3';
import NFTItem from '@/components/NFT/NFTItem.vue';
import FootprintItem from '@/components/FootprintItem.vue';

@Options({
    name: 'SetupFootprints',
    components: {
        FootprintItem,
        NFTItem,
        LoadingContainer,
        Button,
        Card,
        draggable,
        ImgHolder,
    },
})
export default class SetupFootprints extends Vue {
    avatar: string = config.defaultAvatar;
    rss3: IRSS3 | null = null;
    isLoading: Boolean = false;

    show: GeneralAssetWithTags[] = [];
    hide: GeneralAssetWithTags[] = [];

    isPCLayout: boolean = window.innerWidth > 768;

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

        // Setup theme
        const themes = RSS3.getAvailableThemes(await (<IRSS3>this.rss3).assets.get());
        if (themes[0]) {
            document.body.classList.add(themes[0].class);
        } else {
            document.body.classList.remove(...document.body.classList);
        }

        const data = await RSS3.getAssetProfile((<IRSS3>this.rss3).account.address, 'Poap');
        if (data) {
            await this.loadAssets(
                await (<IRSS3>this.rss3).assets.get((<IRSS3>this.rss3).account.address),
                <GeneralAsset[]>data.assets,
            );
        }
    }

    private getAssetOrder(nft: RSS3Asset) {
        let order = -1;
        nft.tags?.forEach((tag: string) => {
            if (tag.startsWith('pass:order:')) {
                order = parseInt(tag.substr(11));
            }
        });
        return order;
    }

    async loadAssets(assetsInRSS3File: RSS3Asset[], assetsGrabbed: GeneralAsset[]) {
        const assetsMerge: GeneralAssetWithTags[] = await Promise.all(
            (assetsGrabbed || []).map(async (ag: GeneralAssetWithTags) => {
                const origType = ag.type;
                ag.type = 'Invalid'; // Using as a match mark
                for (const airf of assetsInRSS3File) {
                    if (
                        airf.platform === ag.platform &&
                        airf.identity === ag.identity &&
                        airf.id === ag.id &&
                        airf.type === origType
                    ) {
                        // Matched
                        ag.type = origType; // Recover type
                        if (airf.tags) {
                            ag.tags = airf.tags;
                        }
                        break;
                    }
                }
                return ag;
            }),
        );

        const FootprintList: GeneralAssetWithTags[] = [];

        for (const am of assetsMerge) {
            if (am.type === 'Poap') {
                FootprintList.push(am);
            } // else Invalid
        }
        this.show = FootprintList.filter((nft) => !nft.tags || nft.tags.indexOf('pass:hidden') === -1).sort(
            (a, b) => this.getAssetOrder(a) - this.getAssetOrder(b),
        );
        this.hide = FootprintList.filter((nft) => nft.tags && nft.tags.indexOf('pass:hidden') !== -1).sort(
            (a, b) => this.getAssetOrder(a) - this.getAssetOrder(b),
        );
    }

    hideAll() {
        this.hide.push(...this.show.splice(0, this.show.length));
    }
    showAll() {
        this.show.push(...this.hide.splice(0, this.hide.length));
    }

    back() {
        window.history.back();
    }

    async save() {
        this.isLoading = true;
        await Promise.all(
            this.show.map((footprint, index) => {
                return this.rss3?.assets.patchTags(
                    {
                        type: footprint.type,
                        platform: footprint.platform,
                        identity: footprint.identity,
                        id: footprint.id,
                    },
                    [`pass:order:${index}`],
                );
            }),
        );
        await Promise.all(
            this.hide.map((footprint) => {
                return this.rss3?.assets.patchTags(
                    {
                        type: footprint.type,
                        platform: footprint.platform,
                        identity: footprint.identity,
                        id: footprint.id,
                    },
                    ['pass:hidden'],
                );
            }),
        );
        await this.rss3?.files.sync();
        this.isLoading = false;
        window.history.back();
    }
}
</script>

<style lang="postcss" scoped></style>
