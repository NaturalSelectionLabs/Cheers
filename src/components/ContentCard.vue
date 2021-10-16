<template>
    <div class="w-full relative p-4 pb-8 bg-transparent border-card text-body-text rounded cursor-pointer">
        <div class="timestamp absolute right-4 bottom-2 font-light">{{ getDate(timestamp) }}</div>
        <div class="content-header flex justify-between">
            <h2 class="font-medium text-lg truncate">
                {{ title }}
            </h2>
            <ContentBadge :contentProvider="$props.provider" />
        </div>
        <div class="content-body" v-html="renderedContent" />
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import ContentBadge from '@/components/ContentBadge.vue';
import marked from 'marked';

@Options({
    components: { ContentBadge },
    props: {
        title: String,
        content: String,
        timestamp: Number,
        provider: String,
    },
})
export default class ContentCard extends Vue {
    content!: string;
    renderedContent: string = '';

    mounted() {
        this.renderedContent = marked(this.content.replaceAll('\n', '<br>') || '');
    }

    getDate(timestamp: number): string {
        return new Date(timestamp * 1000).toLocaleDateString('en-US');
    }
}
</script>

<style lang="postcss">
.content-body .emoji {
    max-width: 1.8rem;
    max-height: 1.8rem;
    display: inline;
}
.content-body .media {
    @apply mt-2 rounded-md;
}
</style>
