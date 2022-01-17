<template>
    <div
        class="
            h-screen
            text-body-text
            bg-body-bg bg-gradient-to-tr
            from-blue-400
            to-blue-200
            via-blue-100
            overflow-y-auto
        "
    >
        <div class="flex flex-col m-auto pt-8 px-4 max-w-screen-lg h-full">
            <Header title="Manage NFTs" :avatar="avatar" />

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
                    <TransBarCard
                        v-if="isPCLayout"
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
                                        :image-url="element.detail.image_preview_url"
                                    />
                                </template>
                            </draggable>
                        </template>
                    </TransBarCard>
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
                                        :image-url="element.detail.image_preview_url"
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
                                        :image-url="element.detail.image_preview_url"
                                    />
                                </template>
                            </draggable>
                        </template>
                    </TransBarCard>
                    <div class="flex flex-row-reverse gap-5 m-auto px-4 py-2 w-full md:flex-col">
                        <Button
                            size="lg"
                            class="flex-1 text-primary-btn-text text-lg bg-primary-btn shadow-primary-btn"
                            @click="save"
                        >
                            <span>Save</span>
                        </Button>
                        <Button
                            size="lg"
                            class="flex-1 text-secondary-btn-text text-lg bg-secondary-btn shadow-secondary-btn"
                            @click="back"
                        >
                            <span>Discard</span>
                        </Button>
                    </div>
                </section>
            </div>

            <LoadingContainer v-show="isLoading" />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import Card from '@/components/Card/Card.vue';
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

@Options({
    name: 'SetupNFTs',
    components: {
        SwitchButton,
        TransBarCard,
        LoadingContainer,
        Button,
        Card,
        NFTItem,
        draggable,
        Header,
    },
})
export default class SetupNFTs extends Vue {
    avatar: string = legacyConfig.defaultAvatar;
    isLoading: Boolean = false;
    isPCLayout: boolean = window.innerWidth > config.ui.md;
    classifiedList: {
        [className: string]: DetailedNFT[];
    } = {
        Vitrine: [],
        Games: [],
        Awards: [],
        Organizations: [],
    };
    allClasses: string[] = Object.keys(this.classifiedList);
    activatedClassName: string = this.allClasses[0];
    hiddenList: DetailedNFT[] = [];

    async mounted() {
        this.isLoading = true;
        await utils.tryEnsureOrRedirect(this.$route, this.$router);
        const loginUser = await RSS3.getLoginUser();
        await RSS3.setPageOwner(loginUser.address);
        const profile = loginUser.profile;
        this.avatar = profile?.avatar?.[0] || legacyConfig.defaultAvatar;

        // Get NFTs
        const { nftsWithClassName, hiddenNfts } = await utils.initAssets();

        const displayedNFTsDetail = await utils.loadAssets(nftsWithClassName);

        await Promise.all(
            nftsWithClassName.map((nft) => {
                const className = nft.class || 'Vitrine';
                if (!(className in this.classifiedList)) {
                    this.classifiedList[className] = [];
                }
                this.classifiedList[className].push(
                    displayedNFTsDetail.find(
                        (dNFT) => dNFT.id === RSS3Utils.id.getAsset(nft.platform, nft.identity, nft.type, nft.uniqueID),
                    ) || {},
                );
            }),
        );
        this.hiddenList = await utils.loadAssets(hiddenNfts);
        this.allClasses = Object.keys(this.classifiedList);

        // Activate default class
        const sessionSpecifiedClassName = sessionStorage.getItem('NFTEditDefaultExpandClassName');
        if (sessionSpecifiedClassName) {
            sessionStorage.removeItem('NFTEditDefaultExpandClassName');
            this.activatedClassName = sessionSpecifiedClassName;
        }
        this.isLoading = false;
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
        this.isLoading = true;

        // await utils.setAssetTags(listed, unlisted);
        const assets: CustomField_PassAssets[] = [];

        await Promise.all(
            this.allClasses.map(async (className) => {
                await Promise.all(
                    this.classifiedList[className].map((nft, index) => {
                        assets.push({
                            id: nft.id,
                            class: className,
                            order: index + 1, // prevent 0 (which will not be saved)
                        });
                    }),
                );
            }),
        );

        await Promise.all(
            this.hiddenList.map((hiddenNFT) => {
                assets.push({
                    id: hiddenNFT.id,
                    hide: true,
                });
            }),
        );

        await utils.updateAssetTags(assets);

        this.isLoading = false;
        await this.back();
    }
}
</script>

<style lang="postcss" scoped></style>
