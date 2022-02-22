<template>
    <router-view v-slot="{ Component }">
        <keep-alive include="EditProfile,Home,Accounts,NFTs,Gitcoins,Footprints,Followers,Followings">
            <component :is="Component" />
        </keep-alive>
    </router-view>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import RSS3 from '@/common/rss3';

@Options({})
export default class App extends Vue {
    async mounted() {
        await RSS3.reconnect();
    }
}
</script>

<style lang="postcss">
#app {
    @apply font-sf-compact-rounded;
}
</style>
