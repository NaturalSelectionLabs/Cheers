<template>
    <h1>Test page</h1>
    <div class="flex flex-col gap-8 items-center">
        <Button size="sm" class="w-10 h-10 bg-white text-primary shadow-secondary">
            <i class="bx bx-chevron-left bx-sm"></i>
        </Button>
        <Button size="sm" class="w-10 h-10 bg-white text-primary shadow-secondary">
            <i class="bx bx-x bx-sm"></i>
        </Button>
        <Button size="sm" class="w-10 h-10 bg-account-button text-white shadow-account">
            <i class="bx bx-plus bx-sm"></i>
        </Button>

        <div class="flex flex-row gap-7">
            <Button size="sm" class="w-10 h-10 bg-account-button text-white shadow-account">
                <i class="bx bxs-copy bx-sm"></i>
            </Button>
            <Button size="sm" class="w-10 h-10 bg-account-button text-white shadow-account">
                <i class="bx bx-link-external bx-sm"></i>
            </Button>
        </div>

        <div class="flex flex-row gap-2">
            <Button size="sm" class="w-8 h-8 bg-white text-account-button shadow-account-sm">
                <i class="bx bxs-pencil bx-xs"></i>
            </Button>
            <Button size="sm" class="w-8 h-8 bg-white text-account-button shadow-account-sm">
                <i class="bx bx-expand-alt bx-xs"></i>
            </Button>
        </div>

        <div class="flex flex-row gap-2">
            <Button size="sm" class="w-8 h-8 bg-white text-nft-button shadow-nft-sm">
                <i class="bx bxs-pencil bx-xs"></i>
            </Button>
            <Button size="sm" class="w-8 h-8 bg-white text-nft-button shadow-nft-sm">
                <i class="bx bx-expand-alt bx-xs"></i>
            </Button>
        </div>

        <div class="flex flex-row gap-2">
            <Button size="sm" class="w-8 h-8 bg-white text-content-button shadow-content-md">
                <i class="bx bxs-pencil bx-xs"></i>
            </Button>
            <Button size="sm" class="w-8 h-8 bg-white text-content-button shadow-content-md">
                <i class="bx bx-expand-alt bx-xs"></i>
            </Button>
        </div>

        <div class="flex flex-row gap-5">
            <Button size="lg" class="w-45 text-lg bg-white text-primary shadow-secondary"> Discard </Button>
            <Button size="lg" class="w-45 text-lg bg-primary text-white shadow-primary"> Save </Button>
        </div>

        <Button size="lg" class="w-80 text-2xl bg-primary text-white shadow-primary"> Connect A Wallet </Button>

        <Button size="lg" class="w-80 text-lg bg-white text-primary shadow-secondary">
            <span>Edit Profile</span>
            <i class="bx bx-pencil bx-sm"></i>
        </Button>

        <Button size="lg" class="w-80 text-lg bg-white text-primary shadow-secondary">
            <span>Follow</span>
            <i class="bx bx-plus bx-sm"></i>
        </Button>

        <Button size="lg" class="w-80 text-lg bg-white text-primary shadow-secondary">
            <span>Following</span>
            <i class="bx bx-check bx-sm"></i>
        </Button>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';

@Options({
    components: { Button },
})
export default class Test extends Vue {}
</script>

<style></style>
