<template>
    <div class="h-screen text-body-text overflow-y-auto">
        <div class="flex flex-col m-auto pt-8 px-4 max-w-screen-lg h-full">
            <Header />
            <div class="flex flex-col flex-grow gap-4 pb-8 h-0 md:flex-row">
                <section class="flex flex-col gap-4 h-1/2 md:w-3/5 md:h-full md:overflow-y-auto">
                    <TransBarCard title="Default" :have-details="true">
                        <template #details>
                            <div class="relative">
                                <EVMpAccountItem
                                    class="inline-flex m-0.5 rounded-full"
                                    :size="64"
                                    chain="Ethereum"
                                    :address="ethAddress"
                                    :enable-tooltip="true"
                                />
                            </div>
                        </template>
                    </TransBarCard>
                    <TransBarCard
                        title="Listed"
                        class="h-full"
                        :tips="mode !== 'delete' ? 'Drag here to show and reorder' : 'Delete unwanted accounts'"
                        :have-details="true"
                    >
                        <template #header>
                            <div class="flex flex-row gap-2">
                                <Button
                                    v-if="mode === 'delete'"
                                    size="sm"
                                    class="w-8 h-8 text-account-btn-s-text bg-account-btn-s"
                                    @click="mode = 'normal'"
                                >
                                    <i class="bx bx-check bx-xs" />
                                </Button>
                                <Button
                                    v-else
                                    size="sm"
                                    class="w-8 h-8 text-account-btn-s-text bg-account-btn-s"
                                    @click="mode = 'delete'"
                                >
                                    <i class="bx bx-minus bx-xs" />
                                </Button>
                                <Button
                                    v-if="mode === 'add'"
                                    size="sm"
                                    class="w-8 h-8 text-account-btn-s-text bg-account-btn-s"
                                    @click="mode = 'normal'"
                                >
                                    <i class="bx bx-x bx-xs" />
                                </Button>
                                <Button
                                    v-else
                                    size="sm"
                                    class="w-8 h-8 text-account-btn-m-text bg-account-btn-m"
                                    @click="mode = 'add'"
                                >
                                    <i class="bx bx-plus bx-xs" />
                                </Button>
                            </div>
                        </template>
                        <template #details>
                            <div v-if="mode === 'add'" class="text-center md:h-screen-30">
                                <div>
                                    <EVMpAccountItem
                                        class="inline-flex m-0.5 rounded-full cursor-pointer"
                                        :size="64"
                                        @click="addMetamaskAccount"
                                    />
                                </div>
                                <div>
                                    <AccountItem
                                        v-for="platform in additionalNoSignAccounts"
                                        :key="platform"
                                        class="inline-flex m-0.5 rounded-full cursor-pointer"
                                        :size="64"
                                        :chain="platform"
                                        @click="addNoSignAccount(platform)"
                                    />
                                </div>
                            </div>
                            <div v-else-if="mode === 'delete'" class="md:h-screen-30">
                                <div>
                                    <div
                                        class="inline-flex m-0.5 rounded-full cursor-pointer"
                                        v-for="(item, index) in show"
                                        :key="item.id"
                                    >
                                        <EVMpAccountItem
                                            v-if="parseAccount(item.id).platform === 'EVM+'"
                                            :size="64"
                                            :address="parseAccount(item.id).identity"
                                            :enable-tooltip="true"
                                            :delete-mode="true"
                                            @delete-account="deleteAccount(index)"
                                        />
                                        <AccountItem
                                            v-else
                                            :size="64"
                                            :chain="parseAccount(item.id).platform"
                                            :address="parseAccount(item.id).identity"
                                            :enable-tooltip="true"
                                            :delete-mode="true"
                                            @delete-account="deleteAccount(index)"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div v-else class="flex flex-col h-full">
                                <draggable
                                    class="flex-grow h-0 overflow-y-auto"
                                    :list="show"
                                    group="accounts"
                                    itemKey="chain"
                                    :animation="200"
                                >
                                    <template #item="{ element }">
                                        <div class="inline-flex m-0.5 rounded-full" style="cursor: grab">
                                            <EVMpAccountItem
                                                v-if="parseAccount(element.id).platform === 'EVM+'"
                                                :size="64"
                                                :address="parseAccount(element.id).identity"
                                                :enable-tooltip="true"
                                            />
                                            <AccountItem
                                                v-else
                                                :size="64"
                                                :chain="parseAccount(element.id).platform"
                                                :address="parseAccount(element.id).identity"
                                                :enable-tooltip="true"
                                            />
                                        </div>
                                    </template>
                                </draggable>
                            </div>
                        </template>
                    </TransBarCard>
                </section>
                <section class="flex flex-col gap-4 h-1/2 md:w-2/5 md:h-full">
                    <TransBarCard
                        title="Unlisted"
                        class="h-full"
                        tips="Drag here to hide"
                        :is-secondary="true"
                        :have-details="true"
                    >
                        <template #details>
                            <draggable
                                class="flex-grow h-0 overflow-y-auto"
                                :list="hide"
                                group="accounts"
                                itemKey="chain"
                                :animation="200"
                            >
                                <template #item="{ element }">
                                    <div class="inline-flex m-0.5 rounded-full" style="cursor: grab">
                                        <EVMpAccountItem
                                            v-if="parseAccount(element.id).platform === 'EVM+'"
                                            :size="64"
                                            :address="parseAccount(element.id).identity"
                                            :enable-tooltip="true"
                                        />
                                        <AccountItem
                                            v-else
                                            :size="64"
                                            :chain="parseAccount(element.id).platform"
                                            :address="parseAccount(element.id).identity"
                                            :enable-tooltip="true"
                                        />
                                    </div>
                                </template>
                            </draggable>
                        </template>
                    </TransBarCard>
                    <div class="flex flex-row-reverse gap-5 m-auto px-4 py-2 w-full md:flex-col">
                        <Button size="lg" class="flex-1 text-body-text text-lg bg-primary-btn" @click="save">
                            <span>Save</span>
                        </Button>
                        <Button size="lg" class="text-secondary-btn-text flex-1 text-lg bg-secondary-btn" @click="back">
                            <span>Discard</span>
                        </Button>
                    </div>
                </section>
            </div>

            <LoadingContainer v-show="isLoading" :isLooping="true" />

            <Modal v-if="isShowingAddSpecifyAccountInput">
                <template #header>
                    <h1>{{ specifyNoSignAccount.platform }}</h1>
                </template>
                <template #body>
                    <p class="mt-6">
                        Input
                        <span class="text-primary-text">{{ specifyNoSignAccount.platform }}</span>
                        account:
                        <span
                            v-if="specifyNoSignAccount.notice"
                            @click="
                                () => {
                                    addAccountNotice = specifyNoSignAccount.notice;
                                    isNoticeErrorReport = false;
                                    isShowingAddAccountNotice = true;
                                }
                            "
                        >
                            <i class="bx bx-help-circle text-xl opacity-40 cursor-pointer" />
                        </span>
                    </p>
                    <div class="flex">
                        <Input
                            class="mt-4 text-primary-text text-xl"
                            :is-single-line="true"
                            :placeholder="specifyNoSignAccount.style"
                            v-model="specifyNoSignAccount.account"
                            :prefix="specifyNoSignAccount.prefix"
                            :suffix="specifyNoSignAccount.suffix"
                            @keyup.enter.native="addNoSignAccountConfirm"
                        />
                    </div>
                    <p class="mt-4 text-sm">
                        <i class="bx bx-info-circle text-primary-text" />
                        You need to place one of your
                        <span class="text-primary-text"> RNS, DAS, ENS or Address </span>
                        into one of those fields of your
                        <span class="text-primary-text"> {{ specifyNoSignAccount.platform }} </span>
                        account :
                        <span>{{ specifyNoSignAccount.fields.join(', ') }}</span>
                        .
                    </p>
                </template>
                <template #footer>
                    <div class="flex flex-row gap-5">
                        <Button size="sm" class="w-32" @click="isShowingAddSpecifyAccountInput = false">
                            Cancel
                        </Button>
                        <Button size="sm" class="w-32 text-body-text bg-primary-btn" @click="addNoSignAccountConfirm">
                            Confirm
                        </Button>
                    </div>
                </template>
            </Modal>

            <Modal v-if="isShowingAddAccountNotice">
                <template #header>
                    <h1>{{ isNoticeErrorReport ? 'Oops!' : 'Tips' }}</h1>
                </template>
                <template #body>
                    <p class="mt-1 p-4 whitespace-pre-line">
                        {{ addAccountNotice }}
                    </p>
                </template>
                <template #footer>
                    <div class="flex flex-row gap-5">
                        <Button
                            size="sm"
                            class="w-72 text-body-text bg-primary-btn"
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
import Button from '@/components/Button/Button.vue';
import Card from '@/components/Card/Card.vue';
import AccountItem from '@/components/Account/AccountItem.vue';
import Modal from '@/components/Common/Modal.vue';
import Loading from '@/components/Loading/Loading.vue';
import LoadingContainer from '@/components/Loading/LoadingContainer.vue';
import RSS3 from '@/common/rss3';
import { utils as RSS3Utils } from 'rss3';
import config from '@/config';
import ContentProviders from '@/common/content-providers';

import draggable from 'vuedraggable';
import Input from '@/components/Input/Input.vue';
import EVMpAccountItem from '@/components/Account/EVMpAccountItem.vue';
import Header from '@/components/Common/Header.vue';
import utils from '@/common/utils';
import TransBarCard from '@/components/Card/TransBarCard.vue';

@Options({
    name: 'SetupAccounts',
    components: {
        TransBarCard,
        EVMpAccountItem,
        Input,
        Modal,
        Button,
        Card,
        AccountItem,
        draggable,
        Loading,
        LoadingContainer,
        Header,
    },
})
export default class SetupAccounts extends Vue {
    avatar: string = config.defaultAvatar;
    additionalMetamaskAccounts: String[] = ['Ethereum', 'BSC'];
    additionalNoSignAccounts: String[] = ['Misskey', 'Twitter', 'Jike'];
    show: RSS3Account[] = [];
    hide: RSS3Account[] = [];
    toAdd: RSS3Account[] = [];
    toDelete: RSS3Account[] = [];
    isLoading: Boolean = false;
    isShowingAddAccountNotice: Boolean = false;
    isNoticeErrorReport: Boolean = true;
    addAccountNotice: String = '';
    isShowingAddSpecifyAccountInput: Boolean = false;
    rns: string = '';
    ethAddress: string = '';
    isAddrCopied: boolean = false;
    isPCLayout: boolean = window.innerWidth > 768;

    mode: String = 'normal';

    specifyNoSignAccount: {
        platform: string;
        style: string;
        account: string;
        fields: string[];
        prefix: string;
        suffix: string;
        notice?: string;
    } = {
        platform: '',
        style: '',
        account: '',
        fields: [],
        prefix: '',
        suffix: '',
    };

    parseAccount = RSS3Utils.id.parseAccount;

    async mounted() {
        await utils.tryEnsureOrRedirect(this.$route, this.$router);
        const loginUser = await RSS3.getLoginUser();
        await RSS3.setPageOwner(loginUser.address);
        if (sessionStorage.getItem('profile')) {
            const profile = JSON.parse(<string>sessionStorage.getItem('profile'));
            this.avatar = profile.avatar;
        } else {
            this.avatar = loginUser.profile?.avatar?.[0] || config.defaultAvatar;
        }

        this.ethAddress = loginUser.address;
        this.rns = loginUser.name;

        const accounts = await loginUser.persona?.profile.accounts;
        if (accounts) {
            const { listed, unlisted } = await utils.initAccounts();
            this.show = listed;
            this.hide = unlisted;
        }
    }

    async addMetamaskAccount() {
        if (!(window as any).ethereum) {
            this.addAccountNotice =
                'Adding accounts are now only supported with MetaMask browser extension enabled. (PC recommended)';
            this.isNoticeErrorReport = true;
            this.isShowingAddAccountNotice = true;
            return;
        }
        const loginUser = await RSS3.getLoginUser();
        const newAccount = await RSS3.addNewMetamaskAccount();
        if (newAccount.id) {
            const equalDefaultAccount = newAccount.id === `EVM+-${loginUser.address}`;
            const showIndex = this.show.findIndex((account) => account.id === newAccount.id);
            const hideIndex = this.hide.findIndex((account) => account.id === newAccount.id);
            if (equalDefaultAccount || showIndex !== -1 || hideIndex !== -1) {
                this.addAccountNotice = 'Account already exist';
                this.isNoticeErrorReport = true;
                this.isShowingAddAccountNotice = true;
            } else {
                this.show.push(newAccount);
                this.toAdd.push(newAccount);
            }
        } else {
            this.addAccountNotice = newAccount.signature || '';
            this.isNoticeErrorReport = true;
            this.isShowingAddAccountNotice = true;
        }
        this.mode = 'normal';
    }

    async addNoSignAccount(platform: string) {
        this.specifyNoSignAccount.platform = platform;
        this.specifyNoSignAccount.style = ContentProviders[platform].accountStyle;
        this.specifyNoSignAccount.fields = ContentProviders[platform].availableFields;
        this.specifyNoSignAccount.prefix = ContentProviders[platform].prefix || '';
        this.specifyNoSignAccount.suffix = ContentProviders[platform].suffix || '';
        if ('notice' in ContentProviders[platform]) {
            this.specifyNoSignAccount.notice = ContentProviders[platform].notice;
        } else {
            this.specifyNoSignAccount.notice = '';
        }

        this.isShowingAddSpecifyAccountInput = true;
    }

    async addNoSignAccountConfirm() {
        if (this.specifyNoSignAccount.account === '') {
            // Empty
            return;
        }
        this.isShowingAddSpecifyAccountInput = false;
        this.isLoading = true;
        let address = '';
        try {
            address =
                'accountPostProcess' in ContentProviders[this.specifyNoSignAccount.platform]
                    ? await ContentProviders[this.specifyNoSignAccount.platform].accountPostProcess(
                          this.specifyNoSignAccount.account,
                      )
                    : this.specifyNoSignAccount.account;
        } catch (e: any) {
            this.addAccountNotice = e.message;
            this.isNoticeErrorReport = true;
            this.isShowingAddAccountNotice = true;
            this.isLoading = false;
            return;
        }

        const newAccount = {
            id: `${this.specifyNoSignAccount.platform}-${address}`,
            signature: '',
        };

        const showIndex = this.show.findIndex((account) => account.id === newAccount.id);
        const hideIndex = this.hide.findIndex((account) => account.id === newAccount.id);

        if (showIndex !== -1 || hideIndex !== -1) {
            this.addAccountNotice = 'Account already exist';
            this.isNoticeErrorReport = true;
            this.isShowingAddAccountNotice = true;
        } else {
            this.show.push(newAccount);
            this.toAdd.push(newAccount);
        }

        this.specifyNoSignAccount.account = '';
        this.isLoading = false;
        this.mode = 'normal';
    }

    async deleteAccount(i: number) {
        if (confirm(`Sure to delete ${this.show[i].id} ?`)) {
            this.toDelete.push(...this.show.splice(i, 1));
        }
    }

    hideAll() {
        this.hide.push(...this.show.splice(0, this.show.length));
    }
    showAll() {
        this.show.push(...this.hide.splice(0, this.hide.length));
    }

    async copyAddressToClipboard() {
        const addr =
            'https://' +
            (this.rns
                ? `${this.rns}.${config.subDomain.rootDomain}`
                : `${config.subDomain.rootDomain}/${this.ethAddress}`);
        await navigator.clipboard.writeText(addr);
        this.isAddrCopied = true;
        setTimeout(() => {
            this.isAddrCopied = false;
        }, 3000);
    }

    back() {
        if (window.history.state.back) {
            window.history.back();
        } else {
            this.$router.push(
                (config.subDomain.isSubDomainMode ? '' : `/${this.rns || this.ethAddress}`) + `/accounts`,
            );
        }
    }

    async save() {
        this.isLoading = true;
        const loginUser = RSS3.getLoginUser();
        if (!loginUser.persona) {
            return;
        }
        // Apply changes
        const accounts = await utils.setAccountsTags(this.show, this.hide);
        for (const account of this.toAdd) {
            const showIndex = this.toDelete.findIndex((needDeleteAccount) => account.id === needDeleteAccount.id);
            if (showIndex === -1) {
                await loginUser.persona.profile.accounts.post(account);
            } else {
                this.toDelete.splice(showIndex, 1);
            }
        }
        for (const account of this.toDelete) {
            await loginUser.persona.profile.accounts.delete(account.id);
        }

        console.log(accounts);

        for (const account of accounts) {
            if (account.tags) {
                await loginUser.persona.profile.accounts.patchTags(account.id, account.tags);
            }
        }

        // Empty arrays before sync
        this.toAdd.splice(0, this.toAdd.length);
        this.toDelete.splice(0, this.toDelete.length);

        try {
            await loginUser.persona.files.sync();
        } catch (e) {
            console.log(e);
            this.isLoading = false;
            this.addAccountNotice = `Fail to save. Maybe you'd like to check if every third-party account (${this.additionalNoSignAccounts.join(
                ' / ',
            )}) works fine ?`;
            this.isNoticeErrorReport = true;
            this.isShowingAddAccountNotice = true;
            return;
        }
        this.isLoading = false;
        await this.back();
    }
}
</script>

<style lang="postcss" scoped></style>
