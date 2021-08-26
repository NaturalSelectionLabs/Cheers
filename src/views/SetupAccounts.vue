<template>
    <div class="px-4 py-9 max-w-md m-auto">
        <div class="flex justify-between items-center mb-4">
            <Button size="sm" class="w-10 h-10 bg-white text-primary shadow-secondary">
                <i class="bx bx-chevron-left bx-sm"></i>
            </Button>
            <span class="text-center">
                <h1 class="text-2xl text-primary font-bold inline">Manage Accounts</h1>
            </span>
            <span class="avatar">
                <img :src="avatar" class="rounded-full w-10 h-10 inline-block" alt="avatar" />
            </span>
        </div>
        <Card
            title="Default ETH Account"
            color-title="text-account-title"
            color-tips="text-account-title"
            color-background="bg-white"
            class="w-full mb-4"
            :is-having-content="true"
        >
            <template #content>
                <AccountItem class="inline-flex m-0.5" :size="64" chain="Ethereum"></AccountItem>
            </template>
        </Card>
        <Card
            title="Additional Accounts"
            color-title="text-account-title"
            color-tips="text-account-title"
            color-background="bg-account-bg"
            class="w-full mb-4"
            :is-having-content="show.length !== 0"
            :tips="show.length === 0 ? 'Add additional wallets' : ''"
        >
            <template #header-button>
                <Button size="sm" class="w-10 h-10 bg-account-button text-white shadow-account">
                    <i class="bx bx-plus bx-sm"></i>
                </Button>
            </template>
            <template #content>
                <draggable class="min-h-20" :list="show" group="accounts" itemKey="chain">
                    <template #item="{ element }">
                        <AccountItem class="shadow-account-sm inline-flex m-0.5" :size="64" :chain="element.chain" />
                    </template>
                </draggable>
            </template>
            <template #footer-button v-if="show.length !== 0">
                <Button size="sm" class="text-xs bg-white text-account-button shadow-nft-sm"> Hide All </Button>
            </template>
        </Card>
        <Card
            title="No-show Accounts"
            color-title="text-account-title"
            color-tips="text-account-title"
            color-background="bg-gray-bg"
            class="w-full mb-4"
            :is-having-content="hide.length !== 0"
            :tips="hide.length === 0 ? 'Drag wallets you’d like to hide here' : ''"
        >
            <template #accessibility>
                <i class="bx bx-info-circle" style="color: rgba(0, 0, 0, 0.2)" />
            </template>
            <template #content>
                <draggable class="min-h-20" :list="hide" group="accounts" itemKey="chain">
                    <template #item="{ element }">
                        <AccountItem class="shadow-account-sm inline-flex m-0.5" :size="64" :chain="element.chain" />
                    </template>
                </draggable>
            </template>
            <template #footer-button v-if="show.length !== 0">
                <Button size="sm" class="text-xs bg-white text-account-button shadow-nft-sm"> Show All </Button>
            </template>
        </Card>
        <div class="flex gap-5">
            <Button size="lg" class="flex-1 text-lg bg-white text-primary shadow-secondary">Discard</Button>
            <Button size="lg" class="flex-1 text-lg bg-primary text-white shadow-primary">Save</Button>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import Card from '@/components/Card.vue';
import AccountItem from '@/components/AccountItem.vue';
import { RSS3Account } from 'rss3-next/types/rss3';

@Options({
    components: {
        Button,
        Card,
        AccountItem,
    },
})
export default class Setup extends Vue {
    accounts: RSS3Account[] = [];
    show: RSS3Account[] = [];
    hide: RSS3Account[] = [];

    async mounted() {}
}
</script>

<style lang="postcss" scoped></style>
