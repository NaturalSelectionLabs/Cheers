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
        <Tooltip v-if="$props.address" v-show="isHover" :text="$props.address" />
        <Button
            v-show="deleteMode"
            size="sm"
            class="w-6 h-6 bg-account-btn-m text-account-btn-m-text shadow-account absolute top-0 right-0 z-20"
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
}
</script>

<style scoped lang="postcss">
@layer components {
    .account-item {
        @apply rounded-full border border-item-border filter shadow-account bg-item-bg bg-85 bg-center bg-no-repeat;
    }
}
</style>
