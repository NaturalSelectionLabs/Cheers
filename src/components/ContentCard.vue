<template>
    <div class="w-full p-2 bg-transparent border-card text-body-text rounded cursor-pointer">
        <h2 class="content-header font-semibold text-lg truncate">
            {{ title }}
        </h2>
        <div class="content-body" v-html="renderedContent" />
        <section class="flex flex-row justify-start items-center gap-2">
            <span class="timestamp font-light opacity-50">
                {{ getDate(timestamp) + ', on' }}
            </span>
            <ContentBadge :contentProvider="$props.provider" />
        </section>
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
        this.renderedContent = marked(this.content.replaceAll('\n', '<br>') || '')
            .replaceAll('img class="emoji"', 'img style="display: inline; max-width: 1.8rem; max-height: 1.8rem;"')
            .replaceAll('img class="media"', 'img class="m-2 rounded-md w-3/4 mx-auto"');
    }

    getDate(timestamp: number): string {
        return new Date(timestamp * 1000).toLocaleDateString('en-US');
    }
}
</script>

<style></style>
