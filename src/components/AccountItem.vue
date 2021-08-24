<template>
    <div class="relative">
        <div
            class="account-item"
            :class="{
                'bg-BSC': chain === 'BSC',
                'bg-Ethereum': chain === 'Ethereum',
                'bg-Ronin': chain === 'Ronin',
            }"
            :style="{ width: size + 'px', height: size + 'px' }"
        ></div>
        <Button
            v-show="deleteMode"
            size="sm"
            class="w-6 h-6 bg-account-button text-white shadow-account absolute top-0 right-0 z-20"
            @click="deleteAccount"
        >
            <i class="bx bx-minus bx-sm"></i>
        </Button>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Button from '@/components/Button.vue';

@Options({
    components: { Button },
    props: {
        size: Number,
        chain: String,
        deleteMode: Boolean,
    },
})
export default class AccountItem extends Vue {
    size!: Number;
    chain!: String;
    deleteMode!: Boolean;

    deleteAccount() {
        this.$emit('deleteAccount');
    }
}
</script>

<style scoped lang="postcss">
@layer components {
    .account-item {
        @apply rounded-full border border-white filter drop-shadow-account bg-white bg-85 bg-center bg-no-repeat;
    }
}
</style>
