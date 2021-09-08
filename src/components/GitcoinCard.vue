<template>
    <div class="w-full flex flex-row justify-start items-center rounded rounded-2xl bg-white shadow-gitcoin-md">
        <img :src="imageUrl" class="w-32 h-32 rounded rounded-2xl m-0.5" />
        <div class="w-45 md:w-60 pl-5">
            <div class="mb-2 font-semibold text-lg overflow-hidden overflow-ellipsis">
                {{ name }}
            </div>
            <div class="w-full flex flex-row gap-x-6 overflow-y-auto">
                <div>
                    <div class="font-medium">{{ contrib }}</div>
                    <div>Contrib</div>
                </div>
                <div>
                    <div class="font-medium">{{ contrib }}</div>
                    <div>ETH</div>
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
