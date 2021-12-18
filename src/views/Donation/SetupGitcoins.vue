<template>
    <div class="h-screen text-body-text bg-body-bg overflow-y-auto">
        <div class="m-auto pb-32 pt-8 px-4 max-w-screen-lg">
            <Header title="Manage Donations" theme="gitcoin" :avatar="avatar" />
            <section class="grid gap-4 grid-cols-1 md:grid-cols-2">
                <Card
                    title="Listed"
                    color-title="text-gitcoin-title"
                    color-tips="text-gitcoin-title"
                    color-background="bg-gitcoin-bg"
                    class="w-full"
                    :is-having-content="true"
                    tips="Drag to reorder"
                >
                    <template #content>
                        <draggable
                            class="min-h-20 md:h-screen-60 md:overflow-y-auto"
                            :list="show"
                            group="gitcoins"
                            data-type="displayed"
                            item-key="displayed"
                            :animation="200"
                        >
                            <template #item="{ element }">
                                <GitcoinItem
                                    class="inline-flex mx-0.5"
                                    style="cursor: grab"
                                    size="md"
                                    :imageUrl="element.detail.grant.logo"
                                />
                            </template>
                        </draggable>
                    </template>
                    <template #footer-button>
                        <Button
                            size="sm"
                            class="text-gitcoin-btn-s-text text-xs bg-gitcoin-btn-s shadow-gitcoin-btn-s"
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
                    color-title="text-gitcoin-title"
                    color-tips="text-gitcoin-title"
                    color-background="bg-card-hide"
                    class="w-full"
                    :is-having-content="true"
                    tips="Drag here to hide"
                >
                    <template #header-button>
                        <Button
                            size="sm"
                            class="text-gitcoin-btn-s-text text-xs bg-gitcoin-btn-s shadow-gitcoin-btn-s"
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
                            group="gitcoins"
                            data-type="displayed"
                            item-key="displayed"
                            :animation="200"
                        >
                            <template #item="{ element }">
                                <GitcoinItem
                                    class="inline-flex mx-0.5"
                                    style="cursor: grab"
                                    size="md"
                                    :imageUrl="element.detail.grant.logo"
                                />
                            </template>
                        </draggable>
                    </template>
                    <template #footer-button>
                        <Button
                            size="sm"
                            class="text-gitcoin-btn-s-text text-xs bg-gitcoin-btn-s shadow-gitcoin-btn-s"
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
import config from '@/config';
import { DetailedDonation } from '@/common/types';
import LoadingContainer from '@/components/Loading/LoadingContainer.vue';
import GitcoinItem from '@/components/Donation/GitcoinItem.vue';
import utils from '@/common/utils';
import Header from '@/components/Common/Header.vue';

@Options({
    name: 'SetupGitcoins',
    components: {
        GitcoinItem,
        LoadingContainer,
        Button,
        Card,
        draggable,
        Header,
    },
})
export default class SetupGitcoins extends Vue {
    avatar: string = config.defaultAvatar;
    isLoading: Boolean = false;

    show: DetailedDonation[] = [];
    hide: DetailedDonation[] = [];

    isPCLayout: boolean = window.innerWidth > 768;

    async mounted() {
        const loginUser = await RSS3.getLoginUser();
        await RSS3.setPageOwner(loginUser.address);
        const profile = loginUser.profile;
        this.avatar = profile?.avatar?.[0] || config.defaultAvatar;

        // Get NFTs
        const { donations, hiddenDonations } = await utils.initAssets();

        this.show = await utils.loadAssets(donations);
        this.hide = await utils.loadAssets(hiddenDonations);
    }

    hideAll() {
        this.hide.push(...this.show.splice(0, this.show.length));
    }
    showAll() {
        this.show.push(...this.hide.splice(0, this.hide.length));
    }

    async save() {
        this.isLoading = true;
        await utils.setAssetTags(
            this.show.map((asset) => asset.id),
            this.hide.map((asset) => asset.id),
        );
        this.isLoading = false;
        window.history.back();
    }

    back() {
        window.history.back();
    }
}
</script>

<style lang="postcss" scoped></style>
