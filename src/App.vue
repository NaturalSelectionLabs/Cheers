<template>
    <router-view />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({})
export default class App extends Vue {}
</script>

<style>
#app {
    width: 100%;
    height: 100vh;
}
</style>
