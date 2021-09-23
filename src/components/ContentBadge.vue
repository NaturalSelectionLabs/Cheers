<template>
    <div class="badge bg-white">
        <Arweave v-if="contentProvider === 'Arweave'" :size="18" />
        <Mirror v-if="contentProvider === 'Mirror-XYZ'" :size="18" />
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Arweave from '@/components/Icons/Arweave.vue';
import Mirror from '@/components/Icons/Mirror.vue';

@Options({
    components: { Arweave, Mirror },
    props: {
        contentProvider: String,
    },
})
export default class NFTBadges extends Vue {
    contentProvider!: String;
}
</script>

<style scoped lang="postcss">
@layer components {
    .badge {
        @apply rounded-full border-sm border-item-border shadow-content-item bg-cover bg-center bg-no-repeat bg-item-bg flex justify-center items-center p-1 w-6 h-6;
    }
}
</style>
