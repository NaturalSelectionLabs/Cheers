<template>
    <Modal v-show="isShowingAccount">
        <template #header>
            <Button size="sm" class="absolute left-4 w-10 h-10" @click="emitCloseDialog">
                <i class="bx bx-chevron-left bx-sm"></i>
            </Button>
        </template>
        <template #body>
            <div class="flex flex-col gap-y-4 items-center">
                <EVMpAccountItem
                    class="m-auto mt-4"
                    v-if="showingAccountDetails.platform === 'EVM+'"
                    :size="90"
                    :address="showingAccountDetails.address"
                />
                <AccountItem
                    class="m-auto mt-4"
                    v-else
                    :size="90"
                    :chain="showingAccountDetails.platform"
                    :address="showingAccountDetails.address"
                />
                <span class="address mt-4 text-center break-all text-xl font-semibold">
                    {{ showingAccountDetails.address }}
                </span>
                <Button
                    size="sm"
                    class="text-md m-auto mt-4 w-1/4 text-account-btn-m-text bg-account-btn-m"
                    @click="
                        showingAccountDetails.isLink
                            ? toExternalLink(showingAccountDetails.link)
                            : copyToClipboard(showingAccountDetails.address)
                    "
                >
                    {{ showingAccountDetails.isLink ? 'Go' : 'Copy' }}
                </Button>
            </div>
        </template>
    </Modal>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Modal from '@/components/Common/Modal.vue';
import Button from '@/components/Button/Button.vue';
import AccountItem from '@/components/Account/AccountItem.vue';
import EVMpAccountItem from '@/components/Account/EVMpAccountItem.vue';

@Options({
    components: { Modal, Button, AccountItem, EVMpAccountItem },
    props: {
        isShowingAccount: Boolean,
        showingAccountDetails: Object,
    },
    emits: ['closeDialog'],
})
export default class AccountModal extends Vue {
    emitCloseDialog() {
        this.$emit('closeDialog');
    }

    copyToClipboard(address: string) {
        navigator.clipboard.writeText(address).then(
            function () {
                console.log('Async: Copying to clipboard was successful!');
            },
            function (err) {
                console.error('Async: Could not copy the account: ', err);
            },
        );
    }

    toExternalLink(link: string) {
        window.open(link);
    }
}
</script>

<style></style>
