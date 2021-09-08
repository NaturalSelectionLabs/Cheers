<template>
    <div class="w-full flex flex-row justify-start items-center rounded rounded-2xl bg-white shadow-gitcoin-md">
        <img :src="imageUrl" class="w-28 h-28 rounded rounded-2xl m-2" />
        <div class="w-45 md:w-60 pl-10">
            <div class="mb-2 font-semibold text-lg">{{ name }}</div>
            <div class="w-full flex flex-row gap-x-6 overflow-y-auto">
                <div>
                    <div class="font-medium">{{ contrib }}</div>
                    <div>Contrib</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

@Options({
    props: {
        imageUrl: String,
        name: String,
        contrib: String,
    },
})
export default class GitcoinCard extends Vue {}
</script>

<style></style>
