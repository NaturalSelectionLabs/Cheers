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
        <div class="m-auto pb-32 pt-8 px-4 max-w-screen-lg h-full">
            <Header title="Manage Footprints" theme="footprint" :avatar="avatar" />
            <div class="flex flex-col gap-4 pb-8 h-full md:flex-row">
                <section class="h-1/2 md:w-3/5 md:h-full">
                    <TransBarCard title="Listed" class="h-full" :have-details="true">
                        <template #details>
                            <draggable
                                class="h-full min-h-20 overflow-y-auto"
                                :list="show"
                                group="footprints"
                                item-key="id"
                                :animation="200"
                            >
                                <template #item="{ element }">
                                    <FootprintItem
                                        class="inline-flex mx-0.5"
                                        style="cursor: grab"
                                        size="md"
                                        :imageUrl="element.detail.image_url"
                                    />
                                </template>
                            </draggable>
                        </template>
                    </TransBarCard>
                </section>
                <section class="h-1/2 md:w-2/5 md:h-full">
                    <TransBarCard title="Unlisted" class="h-full" :have-details="true">
                        <template #details>
                            <draggable
                                class="h-full min-h-20 overflow-y-auto"
                                :list="hide"
                                group="footprints"
                                item-key="id"
                                :animation="200"
                            >
                                <template #item="{ element }">
                                    <FootprintItem
                                        class="inline-flex mx-0.5"
                                        style="cursor: grab"
                                        size="md"
                                        :imageUrl="element.detail.image_url"
                                    />
                                </template>
                            </draggable>
                        </template>
                    </TransBarCard>
                </section>
            </div>
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
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import Card from '@/components/Card/Card.vue';
import draggable from 'vuedraggable';
import RSS3 from '@/common/rss3';
import legacyConfig from '@/config';
import { DetailedFootprint } from '@/common/types';
import LoadingContainer from '@/components/Loading/LoadingContainer.vue';
import FootprintItem from '@/components/Footprint/FootprintItem.vue';
import utils from '@/common/utils';
import Header from '@/components/Common/Header.vue';
import TransBarCard from '@/components/Card/TransBarCard.vue';
import config from '@/common/config';

@Options({
    name: 'SetupFootprints',
    components: {
        TransBarCard,
        FootprintItem,
        LoadingContainer,
        Button,
        Card,
        draggable,
        Header,
    },
})
export default class SetupFootprints extends Vue {
    avatar: string = legacyConfig.defaultAvatar;
    isLoading: Boolean = false;

    show: DetailedFootprint[] = [];
    hide: DetailedFootprint[] = [];

    isPCLayout: boolean = window.innerWidth > config.ui.md;

    async mounted() {
        this.isLoading = true;
        await utils.tryEnsureOrRedirect(this.$route, this.$router);
        const loginUser = await RSS3.getLoginUser();
        await RSS3.setPageOwner(loginUser.address);
        const profile = loginUser.profile;
        this.avatar = profile?.avatar?.[0] || legacyConfig.defaultAvatar;

        // Get NFTs
        const { footprints, hiddenFootprints } = await utils.initAssets();

        this.show = await utils.loadAssets(footprints);
        this.hide = await utils.loadAssets(hiddenFootprints);
        this.isLoading = false;
    }

    hideAll() {
        this.hide.push(...this.show.splice(0, this.show.length));
    }
    showAll() {
        this.show.push(...this.hide.splice(0, this.hide.length));
    }

    back() {
        const pageOwner = RSS3.getPageOwner();
        const rns = pageOwner.name;
        const ethAddress = pageOwner.address;

        if (window.history.state.back) {
            window.history.back();
        } else {
            this.$router.push((legacyConfig.subDomain.isSubDomainMode ? '' : `/${rns || ethAddress}`) + `/footprints`);
        }
    }

    async save() {
        this.isLoading = true;
        await utils.setAssetTags(
            this.show.map((asset) => asset.id),
            this.hide.map((asset) => asset.id),
        );
        this.isLoading = false;
        await this.back();
    }
}
</script>

<style lang="postcss" scoped></style>
