<template>
    <div class="flex flex-row items-center justify-start w-full text-body-text border-card rounded-2xl cursor-pointer">
        <div
            class="flex-shrink m-0.5 w-32 h-32 bg-cover bg-center bg-no-repeat rounded-2xl"
            :style="{ backgroundImage: `url(${imageUrl})` }"
        />
        <div class="flex-1 px-8 w-0 font-semibold">
            <p>{{ 'May, 03, 2021' }}</p>
            <div class="line-clamp-3">
                <span class="text-primary-text">{{ username + ' contributed ' }}</span>
                {{ amount.formatedAmount + ' ' + amount.symbol }}
                <span class="text-primary-text">to</span>
                <div>{{ title }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Vue3Autocounter from 'vue3-autocounter';

@Options({
    components: { Vue3Autocounter },
    props: {
        imageUrl: String,
        title: String,
        username: String,
        amount: Array,
    },
})
export default class GitcoinCard extends Vue {}
</script>

<style></style>
