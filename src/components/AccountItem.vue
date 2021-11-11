<template>
    <div class="relative">
        <div
            class="account-item"
            :class="{
                'bg-BSC': chain === 'BSC',
                'bg-Ethereum': chain === 'Ethereum',
                'bg-Ronin': chain === 'Ronin',
                'bg-Misskey': chain === 'Misskey',
                'bg-Twitter': chain === 'Twitter',
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
            class="absolute z-20 right-0 top-0 w-6 h-6 text-account-btn-m-text bg-account-btn-m shadow-account"
            @click="deleteAccount"
        >
            <i class="bx bx-minus bx-sm"></i>
        </Button>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Button from '@/components/Button.vue';
import Tooltip from '@/components/Tooltip.vue';

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

<style scoped lang="postcss">
@layer components {
    .account-item {
        @apply bg-item-bg bg-85 bg-center bg-no-repeat border border-item-border rounded-full shadow-account filter;
    }
}
</style>
