<template>
    <div class="relative">
        <div
            class="rounded-full border border-item-border bg-item-bg bg-85 bg-center bg-no-repeat filter"
            :class="{
                'bg-BSC': chain === 'BSC',
                'bg-Ethereum': chain === 'Ethereum',
                'bg-Ronin': chain === 'Ronin',
                'bg-Misskey': chain === 'Misskey',
                'bg-Twitter': chain === 'Twitter',
                'bg-Jike': chain === 'Jike',
                'bg-Solana': chain === 'Solana',
            }"
            :style="{ width: size + 'px', height: size + 'px' }"
            @mouseenter="isHover = true"
            @mouseout="isHover = false"
            @touchstart="isHover = true"
            @touchend="isHover = false"
        />
        <Tooltip
            v-if="$props.enableTooltip"
            v-show="isHover"
            :text="addressFilter($props.address)"
            view-option="account"
        />
        <Button
            v-show="deleteMode"
            size="sm"
            class="absolute right-0 top-0 z-20 h-6 w-6 bg-account-btn-m text-account-btn-m-text"
            @click="deleteAccount"
        >
            <i class="bx bx-minus bx-sm"></i>
        </Button>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import Tooltip from '@/components/Common/Tooltip.vue';

@Options({
    components: { Tooltip, Button },
    props: {
        size: Number,
        chain: String,
        deleteMode: Boolean,
        address: String,
        enableTooltip: Boolean,
    },
})
export default class AccountItem extends Vue {
    size!: Number;
    chain!: String;
    deleteMode!: Boolean;

    isHover: boolean = false;

    deleteAccount() {
        this.$emit('deleteAccount');
    }

    addressFilter(address: string) {
        return address.length > 14 ? `${address.slice(0, 6)}....${address.slice(-4)}` : address;
    }
}
</script>

<style></style>
