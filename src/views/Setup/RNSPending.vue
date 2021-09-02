<template>
    <div class="h-screen bg-pending-bg flex justify-center items-center">
        <div class="max-w-md px-4 py-9 flex flex-col justify-center items-center h-full gap-20">
            <Loading size="200" class="mb-50" />
            <div class="w-full text-left font-medium text-primary">
                <p class="text-2xl">Preparing your RNS ...</p>
                <p class="text-base">Hold on a little bit or come back later!</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Loading from '@/components/Loading.vue';
@Options({
    components: { Loading },
})
export default class RNSPending extends Vue {}
</script>

<style lang="postcss" scoped></style>
