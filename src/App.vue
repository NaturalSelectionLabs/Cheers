<template>
    <router-view v-slot="{ Component }">
        <keep-alive include="Setup,EditProfile,Home,Accounts,NFTs,Gitcoins,Footprints">
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

<style>
#app {
    width: 100%;
    height: 100vh;
}

@supports (-webkit-touch-callout: none) {
    #app {
        /* The hack for Safari */
        height: -webkit-fill-available;
    }
}
</style>
