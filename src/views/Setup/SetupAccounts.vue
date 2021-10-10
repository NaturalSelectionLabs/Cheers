<template>
    <div class="h-screen bg-body-bg text-body-text overflow-y-auto">
        <div class="px-4 pt-8 pb-32 max-w-md m-auto">
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
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
                <span class="text-center">
                    <h1 class="text-xl text-primary-text font-bold inline">Manage Accounts</h1>
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
                title="Default"
                color-title="text-account-title"
                color-tips="text-account-title"
                color-background="bg-body-bg"
                class="w-full mb-4 border-account-border"
                :is-having-content="true"
            >
                <template #content>
                    <AccountItem class="shadow-account-sm inline-flex m-0.5 rounded-full" :size="64" chain="Ethereum" />
                </template>
            </Card>
            <Card
                title="Listed"
                color-title="text-account-title"
                color-tips="text-account-title"
                :color-background="mode === 'normal' ? 'bg-account-bg' : 'bg-card-overlay'"
                class="w-full mb-4 border-account-border"
                :is-having-content="true"
                :tips="mode !== 'delete' ? 'Drag here to show and reorder' : 'Delete unwanted accounts'"
            >
                <template #header-button>
                    <div class="flex flex-row gap-2">
                        <Button
                            v-if="mode === 'delete'"
                            size="sm"
                            class="w-8 h-8 bg-account-btn-s text-account-btn-s-text shadow-account-btn-s"
                            @click="mode = 'normal'"
                        >
                            <i class="bx bx-check bx-xs" />
                        </Button>
                        <Button
                            v-else
                            size="sm"
                            class="w-8 h-8 bg-account-btn-s text-account-btn-s-text shadow-account-btn-s"
                            @click="mode = 'delete'"
                        >
                            <i class="bx bx-minus bx-xs" />
                        </Button>
                        <Button
                            v-if="mode === 'add'"
                            size="sm"
                            class="w-8 h-8 bg-account-btn-s text-account-btn-s-text shadow-account-btn-s"
                            @click="mode = 'normal'"
                        >
                            <i class="bx bx-x bx-xs" />
                        </Button>
                        <Button
                            v-else
                            size="sm"
                            class="w-8 h-8 bg-account-btn-m text-account-btn-m-text shadow-account-btn-s"
                            @click="addAccountPreTest"
                        >
                            <i class="bx bx-plus bx-xs" />
                        </Button>
                    </div>
                </template>
                <template #content>
                    <div v-if="mode === 'add'" class="text-center">
                        <div>
                            <AccountItem
                                v-for="chain in additionalMetamaskAccounts"
                                :key="chain"
                                class="inline-flex m-0.5 rounded-full shadow-account cursor-pointer"
                                :size="64"
                                :chain="chain"
                                @click="addMetamaskAccount(chain)"
                            />
                        </div>
                        <div>
                            <AccountItem
                                v-for="platform in additionalNoSignAccounts"
                                :key="platform"
                                class="inline-flex m-0.5 rounded-full shadow-account cursor-pointer"
                                :size="64"
                                :chain="platform"
                                @click="addNoSignAccount(platform)"
                            />
                        </div>
                    </div>
                    <div v-else>
                        <draggable class="min-h-20" :list="show" group="accounts" itemKey="chain">
                            <template #item="{ element, index }">
                                <AccountItem
                                    class="shadow-account-item inline-flex m-0.5 rounded-full"
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
                        class="text-xs bg-account-btn-s text-account-btn-s-text shadow-account-btn-s"
                        :class="{
                            'bg-btn-disabled cursor-not-allowed text-opacity-20': show.length === 0,
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
                color-title="text-account-title"
                color-tips="text-account-title"
                color-background="bg-card-hide"
                class="w-full mb-4 border-account-border"
                :is-having-content="true"
                tips="Drag here to hide"
            >
                <!-- <template #accessibility>
                    <i class="bx bx-info-circle" style="color: rgba(0, 0, 0, 0.2)" />
                </template> -->
                <template #header-button>
                    <Button
                        size="sm"
                        class="text-xs bg-account-btn-s text-account-btn-s-text shadow-account-btn-s"
                        :class="{
                            'bg-btn-disabled cursor-not-allowed text-opacity-20': hide.length === 0,
                        }"
                        :disabled="hide.length === 0"
                        @click="showAll"
                    >
                        <span>Show All</span>
                    </Button>
                </template>
                <template #content>
                    <draggable class="min-h-20" :list="hide" group="accounts" itemKey="chain">
                        <template #item="{ element }">
                            <AccountItem class="inline-flex m-0.5 rounded-full" :size="64" :chain="element.platform" />
                        </template>
                    </draggable>
                </template>
            </Card>
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

            <Modal v-if="isShowingAddSpecifyAccountInput">
                <template #header>
                    <h1>{{ specifyNoSignAccount.platform }}</h1>
                </template>
                <template #body>
                    <p class="mt-6">
                        Input
                        <span class="text-primary-text">{{ specifyNoSignAccount.platform }}</span>
                        account:
                    </p>
                    <div class="flex">
                        <Input
                            class="text-xl mt-6 text-primary-text"
                            :is-single-line="true"
                            :placeholder="specifyNoSignAccount.notice"
                            v-model="specifyNoSignAccount.account"
                            @keyup.enter.native="addNoSignAccountConfirm"
                        />
                    </div>
                </template>
                <template #footer>
                    <div class="flex flex-row gap-5">
                        <Button
                            size="sm"
                            class="w-32 bg-secondary-btn text-secondary-btn-text shadow-secondary-btn"
                            @click="isShowingAddSpecifyAccountInput = false"
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            class="w-32 bg-primary-btn text-primary-btn-text shadow-primary-btn"
                            @click="addNoSignAccountConfirm"
                        >
                            Confirm
                        </Button>
                    </div>
                </template>
            </Modal>

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
                            class="w-72 bg-primary-btn text-primary-btn-text shadow-primary-btn"
                            @click="isShowingAddAccountNotice = false"
                        >
                            <span>OK</span>
                        </Button>
                    </div>
                </template>
            </Modal>
        </div>
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
import RNS from '@/common/rns';
import config from '@/config';
import ContentProviders from '@/common/content-providers';

import draggable from 'vuedraggable';
import Input from '@/components/Input.vue';

@Options({
    name: 'SetupAccounts',
    components: {
        Input,
        Modal,
        Button,
        Card,
        AccountItem,
        draggable,
        Loading,
        LoadingContainer,
    },
})
export default class SetupAccounts extends Vue {
    avatar: String = '';
    additionalMetamaskAccounts: String[] = ['Ethereum', 'BSC'];
    additionalNoSignAccounts: String[] = ['Misskey', 'Twitter'];
    show: RSS3Account[] = [];
    hide: RSS3Account[] = [];
    toAdd: RSS3Account[] = [];
    toDelete: RSS3Account[] = [];
    rss3: IRSS3 | null = null;
    isLoading: Boolean = false;
    isShowingAddAccountNotice: Boolean = false;
    addAccountNotice: String = '';
    isShowingAddSpecifyAccountInput: Boolean = false;

    mode: String = 'normal';

    specifyNoSignAccount: {
        platform: string;
        notice: string;
        account: string;
    } = {
        platform: '',
        notice: '',
        account: '',
    };

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

        // Setup theme
        const themes = RSS3.getAvailableThemes(await (<IRSS3>this.rss3).assets.get());
        if (themes[0]) {
            document.body.classList.add(themes[0].class);
        } else {
            document.body.classList.remove(...document.body.classList);
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

    async addMetamaskAccount(platform: string) {
        const newAccount = await RSS3.addNewMetamaskAccount(platform);
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
            this.addAccountNotice = newAccount.signature || '';
            this.isShowingAddAccountNotice = true;
        }
        this.mode = 'normal';
    }

    async addNoSignAccount(platform: string) {
        this.specifyNoSignAccount.platform = platform;
        if (platform === 'Misskey') {
            this.specifyNoSignAccount.notice = 'username@instance.ltd';
        } else if (platform === 'Twitter') {
            this.specifyNoSignAccount.notice = 'username';
        }
        this.isShowingAddSpecifyAccountInput = true;
    }

    async addNoSignAccountConfirm() {
        this.isShowingAddSpecifyAccountInput = false;
        this.isLoading = true;

        const newAccount = {
            platform: this.specifyNoSignAccount.platform,
            identity: this.specifyNoSignAccount.account,
            signature: '',
        };
        this.show.push(newAccount);
        this.toAdd.push(newAccount);

        this.specifyNoSignAccount.account = '';
        this.isLoading = false;
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

        // Empty arrays before sync
        this.toAdd.splice(0, this.toAdd.length);
        this.toDelete.splice(0, this.toDelete.length);

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
