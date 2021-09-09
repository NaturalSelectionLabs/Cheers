<template>
    <div class="box-border rounded-xl px-5 pb-1 pt-2 bg-account-bg flex flex-row items-center">
        <div class="content flex flex-row items-center w-full overflow-y-auto pb-2 px-2">
            <slot name="content" />
        </div>
        <div class="pb-2 ml-1">
            <slot name="header-button" />
        </div>
    </div>
</template>

<script>
import { Vue, Options } from 'vue-class-component';
export default class AccountCard extends Vue {}
</script>

<style></style>
