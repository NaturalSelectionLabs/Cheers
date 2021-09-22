<template>
    <div class="w-full relative p-4 pb-8 bg-body-bg border-card text-body-text rounded shadow-content-item">
        <div class="timestamp absolute right-4 bottom-2 font-light">{{ getDate(timestamp) }}</div>
        <h2 class="font-medium text-lg truncate">
            {{ title }}
        </h2>
        <p class="line-clamp-3">{{ content }}</p>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
@Options({
    props: {
        title: String,
        content: String,
        timestamp: Number,
    },
})
export default class ContentCard extends Vue {
    getDate(timestamp: number): string {
        return new Date(timestamp * 1000).toLocaleDateString('en-US');
    }
}
</script>

<style scoped></style>
