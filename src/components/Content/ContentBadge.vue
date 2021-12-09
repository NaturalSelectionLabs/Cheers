<template>
    <div class="badge bg-white">
        <Arweave v-if="contentProvider === 'Arweave'" :size="18" />
        <Mirror v-else-if="contentProvider === 'Mirror-XYZ'" :size="18" />
        <Misskey v-else-if="contentProvider === 'Misskey'" :size="18" />
        <Twitter v-else-if="contentProvider === 'Twitter'" :size="18" />
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Arweave from '@/components/Icons/Arweave.vue';
import Mirror from '@/components/Icons/Mirror.vue';
import Misskey from '@/components/Icons/Misskey.vue';
import Twitter from '@/components/Icons/Twitter.vue';

@Options({
    components: { Twitter, Misskey, Arweave, Mirror },
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
        @apply flex items-center justify-center p-1 w-6 h-6 bg-item-bg bg-cover bg-center bg-no-repeat border-sm border-item-border rounded-full shadow-content-item;
    }
}
</style>
