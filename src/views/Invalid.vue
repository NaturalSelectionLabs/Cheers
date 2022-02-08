<template>
    <div class="fixed bottom-0 top-0 flex items-center justify-center w-full text-center">
        <div class="flex flex-col gap-8 items-center justify-between px-4">
            <Logo :size="200" />
            <div class="max-w-md text-primary-text text-2xl">
                <p>This account is invalid...</p>
            </div>
            <div class="mx-auto w-83.5 text-2xl leading-17.5">
                <Button
                    size="lg"
                    class="mb-9 w-full h-17.5 text-body-text bg-primary-btn rounded-3xl"
                    @click="toHomePage"
                >
                    <span> Go Home </span>
                </Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import Logo from '@/components/Icons/Logo.vue';
import legacyConfig from '@/config';
@Options({
    name: 'Invalid',
    components: {
        Button,
        Logo,
    },
})
export default class Invalid extends Vue {
    toHomePage() {
        window.location.href = '//' + legacyConfig.subDomain.rootDomain;
    }
}
</script>

<style></style>
