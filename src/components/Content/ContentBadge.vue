<template>
    <Arweave v-if="contentProvider === 'Arweave'" :size="18" />
    <Mirror v-else-if="contentProvider === 'Mirror-XYZ'" :size="18" />
    <Misskey v-else-if="contentProvider === 'Misskey'" :size="18" />
    <Twitter v-else-if="contentProvider === 'Twitter'" :size="18" />
    <Jike v-else-if="contentProvider === 'Jike'" :size="18" />
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Arweave from '@/components/Icons/Arweave.vue';
import Mirror from '@/components/Icons/Mirror.vue';
import Misskey from '@/components/Icons/Misskey.vue';
import Twitter from '@/components/Icons/Twitter.vue';
import Jike from '@/components/Icons/Jike.vue';

@Options({
    components: { Jike, Twitter, Misskey, Arweave, Mirror },
    props: {
        contentProvider: String,
    },
})
export default class NFTBadges extends Vue {
    contentProvider!: String;
}
</script>

<style scoped lang="postcss"></style>
