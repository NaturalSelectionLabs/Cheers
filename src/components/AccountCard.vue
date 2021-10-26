<template>
    <div
        class="
            flex flex-row
            items-center
            pb-1
            pt-2
            px-5
            bg-account-bg
            border-card border-account-border
            rounded-xl
            box-border
        "
    >
        <div class="content flex flex-row items-center pb-2 px-2 w-full overflow-y-auto">
            <slot name="content" />
        </div>
        <div class="ml-1 pb-2">
            <slot name="header-button" />
        </div>
    </div>
</template>

<script>
import { Vue, Options } from 'vue-class-component';
export default class AccountCard extends Vue {}
</script>

<style></style>
