<template>
    <Modal v-show="isShowingModal">
        <template #body>
            <p class="mt-1 p-4">
                This user has not been invited, copy the address. Reach out for an invitation to get started!
            </p>
            <span class="flex px-2 w-full text-left">
                <i class="bx bx-info-circle mr-2 text-btn-icon text-lg" />
                <span class="break-all"> {{ address }} </span>
            </span>
        </template>
        <template #footer>
            <div class="flex flex-row items-center justify-center">
                <Button size="sm" class="w-20 text-white bg-primary-btn" @click="copyToClipboard(address)">
                    Copy
                </Button>
            </div>
        </template>
    </Modal>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Modal from '@/components/Common/Modal.vue';
import Button from '@/components/Button/Button.vue';
@Options({
    components: { Modal, Button },
    props: {
        isShowingModal: Boolean,
        address: String,
    },
})
export default class InviteModal extends Vue {
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
}
</script>

<style></style>
