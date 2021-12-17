<template>
    <div class="p-2 w-full text-body-text bg-transparent border-card rounded cursor-pointer">
        <h2 class="content-header text-lg font-semibold truncate">
            {{ title }}
        </h2>
        <div class="content-body" v-html="renderedContent" />
        <section class="flex flex-row gap-2 items-center justify-start">
            <span class="timestamp font-light opacity-50">
                {{ getDate(timestamp) + ', on' }}
            </span>
            <ContentBadge :contentProvider="$props.provider" />
        </section>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import ContentBadge from '@/components/Content/ContentBadge.vue';
import { timeDifferent } from '@/common/timeStamp';
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
            .replaceAll('img class="media"', 'img class="m-2 rounded-md w-3/4 mx-auto"')
            .replaceAll('">,<img', '"><img');
    }

    getDate(timestamp: number): string {
        return timeDifferent(timestamp);
    }
}
</script>

<style></style>
