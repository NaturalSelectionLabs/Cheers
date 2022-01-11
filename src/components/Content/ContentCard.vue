<template>
    <div class="p-2 w-full text-body-text bg-transparent border-card rounded cursor-pointer">
        <section class="flex flex-row gap-1 items-center justify-start pb-1 font-light">
            <span class="text-primary-text font-medium">{{ username + ' wrote on ' }}</span>
            <ContentBadge :contentProvider="provider" />
            <span>{{ provider.replaceAll(mirrorSuffix, '') }}</span>
            <span>{{ getDate(timestamp) }}</span>
        </section>
        <section class="pl-2 border-l-2 border-primary-text border-opacity-75">
            <h2 class="content-header text-lg font-semibold truncate">
                {{ title }}
            </h2>
            <div class="content-body" v-html="renderedContent" />
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
        username: String,
        title: String,
        content: String,
        timestamp: Number,
        provider: String,
    },
})
export default class ContentCard extends Vue {
    content!: string;
    renderedContent: string = '';
    mirrorSuffix: string = '-XYZ';

    mounted() {
        this.renderedContent = marked(this.content?.replaceAll('\n', '<br>') || '')
            .replaceAll('img class="emoji"', 'img style="display: inline; max-width: 1.8rem; max-height: 1.8rem;"')
            .replaceAll('img class="media"', 'img class="w-3/4 m-2 mx-auto rounded-md"')
            .replaceAll('">,<img', '"><img');
    }

    getDate(timestamp: number): string {
        return timeDifferent(timestamp);
    }
}
</script>

<style></style>
