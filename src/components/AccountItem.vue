<template>
    <div
        class="account-item"
        :class="{
            'bg-BSC': chain === 'BSC',
            'bg-Ethereum': chain === 'Ethereum',
            'bg-Ronin': chain === 'Ronin',
        }"
        :style="{ width: size + 'px', height: size + 'px' }"
    ></div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

@Options({
    props: {
        size: Number,
        chain: String,
    },
})
export default class AccountItem extends Vue {
    size!: Number;
    chain!: String;
}
</script>

<style scoped lang="postcss">
@layer components {
    .account-item {
        @apply rounded-full border border-white filter drop-shadow-account bg-cover bg-center bg-no-repeat;
    }
}
</style>
