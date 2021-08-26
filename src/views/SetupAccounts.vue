<template>
    <div class="px-4 py-9 max-w-md m-auto">
        <div class="flex justify-between items-center mb-4">
            <Button size="sm" class="w-10 h-10 bg-white text-primary shadow-secondary" @click="back">
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
                <AccountItem class="shadow-account-sm inline-flex m-0.5 rounded-full" size="64" chain="Ethereum" />
            </template>
        </Card>
        <Card
            title="Additional Accounts"
            color-title="text-account-title"
            color-tips="text-account-title"
            :color-background="mode === 'normal' ? 'bg-account-bg' : 'bg-gray-300'"
            class="w-full mb-4"
            :is-having-content="true"
            :tips="mode !== 'delete' ? 'Add additional accounts' : 'Delete unwanted accounts'"
        >
            <template #header-button>
                <div class="flex flex-row gap-2">
                    <Button
                        v-if="mode === 'delete'"
                        size="sm"
                        class="w-8 h-8 bg-white text-account-button shadow-account-sm"
                        @click="mode = 'normal'"
                    >
                        <i class="bx bx-check bx-xs" />
                    </Button>
                    <Button
                        v-else
                        size="sm"
                        class="w-8 h-8 bg-white text-account-button shadow-account-sm"
                        @click="mode = 'delete'"
                    >
                        <i class="bx bx-minus bx-xs" />
                    </Button>
                    <Button
                        v-if="mode === 'add'"
                        size="sm"
                        class="w-8 h-8 bg-white text-account-button shadow-account-sm"
                        @click="mode = 'normal'"
                    >
                        <i class="bx bx-x bx-xs" />
                    </Button>
                    <Button
                        v-else
                        size="sm"
                        class="w-8 h-8 bg-account-button text-white shadow-account-sm"
                        @click="mode = 'add'"
                    >
                        <i class="bx bx-plus bx-xs" />
                    </Button>
                </div>
            </template>
            <template #content>
                <div v-if="mode === 'add'" class="text-center">
                    <AccountItem
                        v-for="chain in additionalAccounts"
                        :key="chain"
                        class="shadow-account-sm inline-flex m-0.5 rounded-full"
                        size="64"
                        :chain="chain"
                        @click="addAccount(chain)"
                    />
                </div>
                <div v-else>
                    <draggable class="min-h-20" :list="show" group="accounts" itemKey="chain">
                        <template #item="{ element, index }">
                            <AccountItem
                                class="shadow-account-sm inline-flex m-0.5 rounded-full"
                                size="64"
                                :chain="element.platform"
                                :delete-mode="mode === 'delete'"
                                @delete-account="deleteAccount(index)"
                            />
                        </template>
                    </draggable>
                </div>
            </template>
            <template #footer-button>
                <Button
                    size="sm"
                    class="text-xs bg-white text-account-button shadow-nft-sm"
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
            title="No-show Accounts"
            color-title="text-account-title"
            color-tips="text-account-title"
            color-background="bg-gray-bg"
            class="w-full mb-4"
            :is-having-content="true"
            tips="Drag accounts you’d like to hide here"
        >
            <template #accessibility>
                <i class="bx bx-info-circle" style="color: rgba(0, 0, 0, 0.2)" />
            </template>
            <template #content>
                <draggable class="min-h-20" :list="hide" group="accounts" itemKey="chain">
                    <template #item="{ element }">
                        <AccountItem
                            class="shadow-account-sm inline-flex m-0.5 rounded-full"
                            size="64"
                            :chain="element.platform"
                        />
                    </template>
                </draggable>
            </template>
            <template #footer-button>
                <Button
                    size="sm"
                    class="text-xs bg-white text-account-button shadow-nft-sm"
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
import AccountItem from '@/components/AccountItem.vue';
import { RSS3Account, RSS3Index } from 'rss3-next/types/rss3';
import RSS3, { IRSS3 } from '@/common/rss3';

import draggable from 'vuedraggable';

@Options({
    components: {
        Button,
        Card,
        AccountItem,
        draggable,
    },
})
export default class Setup extends Vue {
    avatar: String = '';
    additionalAccounts: String[] = ['Ethereum', 'BSC', 'Ronin'];
    show: RSS3Account[] = [];
    hide: RSS3Account[] = [];
    toDelete: RSS3Account[] = [];
    rss3: IRSS3 | null = null;

    mode: String = 'normal';

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

        const file = await (<IRSS3>this.rss3).files.get((<IRSS3>this.rss3).account.address);
        if ((<RSS3Index>file).accounts) {
            (<RSS3Account[]>(<RSS3Index>file).accounts).forEach((account: RSS3Account) => {
                if (account.tags?.includes('hidden')) {
                    this.hide.push(account);
                } else {
                    this.show.push(account);
                }
            });
        }
    }

    async back() {
        // Rollback by remote
        await window.history.back();
    }

    async addAccount(platform: string) {
        await RSS3.addNewAccount(platform);
    }

    async deleteAccount(i: number) {
        this.toDelete.push(...this.show.splice(i, 1));
    }

    hideAll() {
        this.hide.push(...this.show.splice(0, this.show.length));
    }
    showAll() {
        this.show.push(...this.hide.splice(0, this.hide.length));
    }

    async save() {
        // Apply changes
        for (const account of this.show) {
            if (account.tags?.includes('hidden')) {
                // Newly shown
                // Todo: set to shown
            }
        }
        for (const account of this.hide) {
            if (!account.tags?.includes('hidden')) {
                // Newly hide
                // Todo: set to hidden
            }
        }
        for (const account of this.toDelete) {
            await (<IRSS3>this.rss3).accounts.delete(account);
        }

        await (<IRSS3>this.rss3).files.sync();
    }
}
</script>

<style lang="postcss" scoped></style>
