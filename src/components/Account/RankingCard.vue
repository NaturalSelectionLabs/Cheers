<template>
    <section class="flex cursor-pointer flex-row items-center justify-between">
        <div class="flex flex-row items-center justify-start gap-4">
            <div
                class="rounded-full px-4 text-xl font-bold"
                :class="{
                    'bg-primary-btn': isTop,
                    'bg-gray-200': !isTop && !isOwner,
                    'bg-secondary-btn': !isTop && isOwner,
                }"
            >
                {{ '#' + ranking }}
            </div>
            <ImgHolder
                class="my-auto inline-flex h-10 w-10 cursor-pointer"
                :is-rounded="true"
                :is-border="false"
                :src="avatar"
            />
            <div class="truncate text-base font-semibold md:text-xl">{{ name }}</div>
        </div>
        <div class="text-base font-semibold text-primary-text md:text-xl">
            {{ (Math.round(score * 100) / 100).toFixed(2) }}
        </div>
    </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ImgHolder from '@/components/Common/ImgHolder.vue';

@Options({
    name: 'Leaderboard',
    components: { ImgHolder },
    props: {
        avatar: String,
        name: String,
        ranking: String,
        score: String,
        isTop: Boolean,
        isOwner: Boolean,
    },
})
export default class RankingCard extends Vue {
    avatar!: string;
    name!: string;
    ranking!: string;
    score!: string;
}
</script>
