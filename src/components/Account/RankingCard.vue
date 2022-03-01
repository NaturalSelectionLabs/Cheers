<template>
    <section class="flex cursor-pointer flex-row items-center justify-between">
        <div class="flex flex-row items-center justify-start gap-4">
            <div class="rounded-full bg-primary-btn px-4 text-xl font-bold">{{ '#' + ranking }}</div>
            <ImgHolder
                class="my-auto inline-flex h-10 w-10 cursor-pointer"
                :is-rounded="true"
                :is-border="false"
                :src="avatar || defaultAvatar"
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
import config from '@/config';

@Options({
    name: 'Leaderboard',
    components: { ImgHolder },
    props: {
        avatar: String,
        name: String,
        ranking: String,
        score: String,
    },
})
export default class RankingCard extends Vue {
    defaultAvatar: string = config.defaultAvatar;
    avatar!: string;
    name!: string;
    ranking!: string;
    score!: string;
}
</script>
