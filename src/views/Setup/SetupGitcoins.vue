<template>
    <div class="h-screen bg-body-bg text-body-text overflow-y-auto">
        <div class="px-4 py-9 max-w-md m-auto">
            <div class="flex justify-between items-center mb-4">
                <Button
                    size="sm"
                    class="w-10 h-10 bg-secondary-btn text-secondary-btn-text shadow-secondary-btn"
                    @click="back"
                >
                    <i class="bx bx-chevron-left bx-sm" />
                </Button>
                <span class="text-center">
                    <h1 class="text-xl text-gitcoin-title font-bold inline">Manage Donations</h1>
                </span>
                <span class="avatar">
                    <ImgHolder
                        class="w-10 h-10 inline-flex my-auto cursor-pointer"
                        :is-rounded="true"
                        :is-border="false"
                        :src="avatar"
                    />
                </span>
            </div>
            <Card
                title="Listed"
                color-title="text-gitcoin-title"
                color-tips="text-gitcoin-title"
                color-background="bg-gitcoin-bg"
                class="w-full mb-4"
                :is-having-content="true"
                tips="Drag to reorder"
            >
                <template #content>
                    <draggable
                        class="min-h-20"
                        :list="show"
                        group="gitcoins"
                        data-type="displayed"
                        item-key="displayed"
                    >
                        <template #item="{ element }">
                            <GitcoinItem
                                class="inline-flex mx-0.5 cursor-pointer"
                                :size="70"
                                :imageUrl="element.info.image_preview_url"
                            />
                        </template>
                    </draggable>
                </template>
                <template #footer-button>
                    <Button
                        size="sm"
                        class="text-xs bg-gitcoin-btn-s text-gitcoin-btn-s-text shadow-gitcoin-btn-s"
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
                title="Unlisted"
                color-title="text-gitcoin-title"
                color-tips="text-gitcoin-title"
                color-background="bg-card-hide"
                class="w-full mb-4"
                :is-having-content="true"
                tips="Drag here to hide"
            >
                <template #accessibility>
                    <i class="bx bx-info-circle" style="color: rgba(0, 0, 0, 0.2)" />
                </template>
                <template #header-button>
                    <Button
                        size="sm"
                        class="text-xs bg-gitcoin-btn-s text-gitcoin-btn-s-text shadow-gitcoin-btn-s"
                        :class="{
                            'bg-gray-100 cursor-not-allowed': hide.length === 0,
                        }"
                        :disabled="hide.length === 0"
                        @click="showAll"
                    >
                        Show All
                    </Button>
                </template>
                <template #content>
                    <draggable
                        class="min-h-20"
                        :list="hide"
                        group="gitcoins"
                        data-type="displayed"
                        item-key="displayed"
                    >
                        <template #item="{ element }">
                            <GitcoinItem
                                class="inline-flex mx-0.5 cursor-pointer"
                                :size="70"
                                :imageUrl="element.info.image_preview_url"
                            />
                        </template>
                    </draggable>
                </template>
            </Card>
            <div class="px-4 py-4 flex gap-5 fixed bottom-0 left-0 right-0 max-w-md m-auto w-full">
                <Button
                    size="lg"
                    class="flex-1 text-lg bg-secondary-btn text-secondary-btn-text shadow-secondary-btn"
                    @click="back"
                    >Discard</Button
                >
                <Button
                    size="lg"
                    class="flex-1 text-lg bg-primary-btn text-primary-btn-text shadow-primary-btn"
                    @click="save"
                    >Save</Button
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
import GitcoinItem from '@/components/GitcoinItem.vue';

@Options({
    components: {
        GitcoinItem,
        NFTItem,
        LoadingContainer,
        Button,
        Card,
        draggable,
        ImgHolder,
    },
})
export default class SetupGitcoins extends Vue {
    avatar: String = '';
    rss3: IRSS3 | null = null;
    isLoading: Boolean = false;

    show: GeneralAssetWithTags[] = [];
    hide: GeneralAssetWithTags[] = [];

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

        const data = await RSS3.getAssetProfile((<IRSS3>this.rss3).account.address);
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

        const GitcoinList: GeneralAssetWithTags[] = [];

        for (const am of assetsMerge) {
            if (am.type === 'Gitcoin-Donation') {
                GitcoinList.push(am);
            } // else Invalid
        }
        this.show = GitcoinList.filter((nft) => !nft.tags || nft.tags.indexOf('pass:hidden') === -1).sort(
            (a, b) => this.getAssetOrder(a) - this.getAssetOrder(b),
        );
        this.hide = GitcoinList.filter((nft) => nft.tags && nft.tags.indexOf('pass:hidden') !== -1).sort(
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
            this.show.map((gitcoin, index) => {
                return this.rss3?.assets.patchTags(
                    {
                        type: gitcoin.type,
                        platform: gitcoin.platform,
                        identity: gitcoin.identity,
                        id: gitcoin.id,
                    },
                    [`pass:order:${index}`],
                );
            }),
        );
        await Promise.all(
            this.hide.map((gitcoin) => {
                return this.rss3?.assets.patchTags(
                    {
                        type: gitcoin.type,
                        platform: gitcoin.platform,
                        identity: gitcoin.identity,
                        id: gitcoin.id,
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
