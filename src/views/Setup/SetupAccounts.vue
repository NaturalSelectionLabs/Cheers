<template>
    <div class="px-4 py-9 max-w-md m-auto">
        <div class="flex justify-between items-center mb-4">
            <Button size="sm" class="w-10 h-10 bg-white text-primary shadow-secondary" @click="back">
                <i class="bx bx-chevron-left bx-sm"></i>
            </Button>
            <span class="text-center">
                <h1 class="text-xl text-primary font-bold inline">Manage Accounts</h1>
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
            title="Default ETH Account"
            color-title="text-account-title"
            color-tips="text-account-title"
            color-background="bg-white"
            class="w-full mb-4"
            :is-having-content="true"
        >
            <template #content>
                <AccountItem class="shadow-account-sm inline-flex m-0.5 rounded-full" :size="64" chain="Ethereum" />
            </template>
        </Card>
        <Card
            title="Additional Accounts"
            color-title="text-account-title"
            color-tips="text-account-title"
            :color-background="mode === 'normal' ? 'bg-account-bg' : 'bg-gray-300'"
            class="w-full mb-4"
            :is-having-content="true"
            :tips="mode !== 'delete' ? 'Drag here to show and reorder' : 'Delete unwanted accounts'"
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
                        @click="addAccountPreTest"
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
                        :size="64"
                        :chain="chain"
                        @click="addAccount(chain)"
                    />
                </div>
                <div v-else>
                    <draggable class="min-h-20" :list="show" group="accounts" itemKey="chain">
                        <template #item="{ element, index }">
                            <AccountItem
                                class="shadow-account-sm inline-flex m-0.5 rounded-full"
                                :size="64"
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
                    class="text-xs bg-white text-account-button shadow-account-sm"
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
            tips="Drag here to hide"
        >
            <template #accessibility>
                <i class="bx bx-info-circle" style="color: rgba(0, 0, 0, 0.2)" />
            </template>
            <template #header-button>
                <Button
                    size="sm"
                    class="text-xs bg-white text-account-button shadow-account-sm"
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
                <draggable class="min-h-20" :list="hide" group="accounts" itemKey="chain">
                    <template #item="{ element }">
                        <AccountItem
                            class="shadow-account-sm inline-flex m-0.5 rounded-full"
                            :size="64"
                            :chain="element.platform"
                        />
                    </template>
                </draggable>
            </template>
        </Card>
        <div class="px-4 py-4 flex gap-5 fixed bottom-0 left-0 right-0 max-w-md m-auto w-full">
            <Button size="lg" class="flex-1 text-lg bg-white text-primary shadow-secondary" @click="back"
                >Discard</Button
            >
            <Button size="lg" class="flex-1 text-lg bg-primary text-white shadow-primary" @click="save">Save</Button>
        </div>
        <LoadingContainer v-show="isLoading" />

        <Modal v-if="isShowingAddAccountNotice">
            <template #header>
                <h1>Oops!</h1>
            </template>
            <template #body>
                <p class="mt-1 p-4">
                    {{ addAccountNotice }}
                </p>
            </template>
            <template #footer>
                <div class="flex flex-row gap-5">
                    <Button
                        size="sm"
                        class="w-72 bg-primary text-white shadow-primary"
                        @click="isShowingAddAccountNotice = false"
                    >
                        OK
                    </Button>
                </div>
            </template>
        </Modal>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import Card from '@/components/Card.vue';
import AccountItem from '@/components/AccountItem.vue';
import Modal from '@/components/Modal.vue';
import Loading from '@/components/Loading.vue';
import LoadingContainer from '@/components/LoadingContainer.vue';
import { RSS3Account, RSS3Index } from 'rss3-next/types/rss3';
import RSS3, { IRSS3 } from '@/common/rss3';
import config from '@/config';

import draggable from 'vuedraggable';

@Options({
    components: {
        Modal,
        Button,
        Card,
        AccountItem,
        draggable,
        Loading,
        LoadingContainer,
    },
})
export default class Setup extends Vue {
    avatar: String = '';
    additionalAccounts: String[] = ['Ethereum', 'BSC'];
    show: RSS3Account[] = [];
    hide: RSS3Account[] = [];
    toAdd: RSS3Account[] = [];
    toDelete: RSS3Account[] = [];
    rss3: IRSS3 | null = null;
    isLoading: Boolean = false;
    isShowingAddAccountNotice: Boolean = false;
    addAccountNotice: String = '';

    mode: String = 'normal';

    async mounted() {
        if (!(await RSS3.reconnect())) {
            sessionStorage.setItem('redirectFrom', this.$route.fullPath);
            await this.$router.push('/');
        }
        this.rss3 = await RSS3.get();
        if (sessionStorage.getItem('profile')) {
            const profile = JSON.parse(<string>sessionStorage.getItem('profile'));
            this.avatar = profile.avatar;
        } else {
            const profile = await (<IRSS3>this.rss3).profile.get();
            this.avatar = profile?.avatar?.[0] || config.defaultAvatar;
        }

        const accounts = await (<IRSS3>this.rss3).accounts.get((<IRSS3>this.rss3).account.address);
        if (accounts) {
            accounts.forEach((account: RSS3Account) => {
                if (account.tags?.includes('hidden')) {
                    this.hide.push(account);
                } else {
                    this.show.push(account);
                }
            });
            this.hide.sort((a, b) => {
                return this.getTaggedOrder(a) - this.getTaggedOrder(b);
            });
            this.show.sort((a, b) => {
                return this.getTaggedOrder(a) - this.getTaggedOrder(b);
            });
        }
    }

    getTaggedOrder(account: RSS3Account): number {
        if (!account.tags) {
            return -1;
        }
        const orderPattern = /^pass:order:(-?\d+)$/i;
        for (const tag of account.tags) {
            if (orderPattern.test(tag)) {
                return parseInt(orderPattern.exec(tag)?.[1] || '-1');
            }
        }
        return -1;
    }

    setTaggedOrder(account: RSS3Account, order: number): void {
        if (!account.tags) {
            account.tags = [];
        } else {
            const orderPattern = /^pass:order:(-?\d+)$/i;
            const oldIndex = account.tags.findIndex((tag) => orderPattern.test(tag));
            if (oldIndex !== -1) {
                account.tags.splice(oldIndex, 1);
            }
        }
        account.tags.push(`pass:order:${order}`);
    }

    async back() {
        // Rollback by remote
        await window.history.back();
    }

    async addAccountPreTest() {
        if (!(window as any).ethereum) {
            this.addAccountNotice =
                'Adding accounts are now only supported with MetaMask browser extension enabled. (PC recommended)';
            this.isShowingAddAccountNotice = true;
        } else {
            this.mode = 'add';
        }
    }

    async addAccount(platform: string) {
        const newAccount = await RSS3.addNewAccount(platform);
        if (newAccount.identity) {
            const equalDefaultAccount =
                newAccount.platform === 'Ethereum' && newAccount.identity === (<IRSS3>this.rss3).account.address;
            const showIndex = this.show.findIndex(
                (account) => account.platform === newAccount.platform && account.identity === newAccount.identity,
            );
            const hideIndex = this.hide.findIndex(
                (account) => account.platform === newAccount.platform && account.identity === newAccount.identity,
            );
            if (equalDefaultAccount || showIndex !== -1 || hideIndex !== -1) {
                this.addAccountNotice = 'Account already exist';
                this.isShowingAddAccountNotice = true;
            } else {
                this.show.push(newAccount);
                this.toAdd.push(newAccount);
            }
        } else {
            this.addAccountNotice = newAccount.signature;
            this.isShowingAddAccountNotice = true;
        }
        this.mode = 'normal';
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
        this.isLoading = true;
        // Apply changes
        for (const [order, account] of this.show.entries()) {
            if (!account.tags) {
                account.tags = [];
            }
            if (account.tags.includes('hidden')) {
                // Newly shown
                account.tags.splice(account.tags?.indexOf('hidden'), 1);
            }
            this.setTaggedOrder(account, order);
            await (<IRSS3>this.rss3).accounts.patchTags(
                {
                    platform: account.platform,
                    identity: account.identity,
                },
                account.tags,
            );
        }
        for (const [order, account] of this.hide.entries()) {
            if (!account.tags) {
                account.tags = [];
            }
            if (!account.tags?.includes('hidden')) {
                // Newly hide
                account.tags.push('hidden');
            }
            this.setTaggedOrder(account, order);
            await (<IRSS3>this.rss3).accounts.patchTags(
                {
                    platform: account.platform,
                    identity: account.identity,
                },
                account.tags,
            );
        }
        for (const account of this.toAdd) {
            const showIndex = this.toDelete.findIndex(
                (needDeleteAccount) =>
                    account.platform === needDeleteAccount.platform && account.identity === needDeleteAccount.identity,
            );
            if (showIndex === -1) {
                await (<IRSS3>this.rss3).accounts.post(account);
            } else {
                this.toDelete.splice(showIndex, 1);
            }
        }
        for (const account of this.toDelete) {
            await (<IRSS3>this.rss3).accounts.delete(account);
        }

        try {
            await (<IRSS3>this.rss3).files.sync();
        } catch (e) {
            console.log(e);
            this.isLoading = false;
            return;
        }
        this.isLoading = false;
        window.history.back(); // Back
    }

    public toPublicPage() {
        this.$router.push(`/${(<IRSS3>this.rss3).account.address}`);
    }
}
</script>

<style lang="postcss" scoped></style>
