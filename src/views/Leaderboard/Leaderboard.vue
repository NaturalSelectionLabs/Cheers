<template>
    <div class="m-auto max-w-screen-lg px-4 py-9 text-body-text">
        <Header title="Leaderboard" />
        <div class="m-auto mt-4 flex max-w-screen-sm flex-col gap-8">
            <section class="flex flex-col gap-4 p-4">
                <RankingCard
                    :avatar="item.avatar"
                    :name="item.name"
                    :ranking="index + 1"
                    :score="item.score"
                    v-for="(item, index) in topThree"
                    :key="item.persona"
                />
            </section>
            <section class="flex flex-col gap-4 rounded border-card bg-card-bg p-4">
                <RankingCard
                    :avatar="item.avatar"
                    :name="item.name"
                    :ranking="index + 1"
                    :score="item.score"
                    v-for="(item, index) in range"
                    :key="item.persona"
                />
            </section>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import RankingCard from '@/components/Account/RankingCard.vue';
import Header from '@/components/Common/Header.vue';
import utils from '@/common/utils';
import RSS3 from '@/common/rss3';

@Options({
    name: 'Leaderboard',
    components: { Header, RankingCard },
})
export default class Leaderboard extends Vue {
    topThree: any[] = [];
    range: any[] = [];
    ethAddress: string = '';

    async mounted() {
        const aon = utils.getAddress(<string>this.$route.params.address);
        const pageOwner = await RSS3.setPageOwner(aon);

        if (parseInt(pageOwner.address) === 0) {
            this.$router.push('/invalid');
            return;
        }
        this.ethAddress = pageOwner.address;
        this.getLeaderboard();
    }

    async getLeaderboard() {
        const res = await fetch(`https://raas.cheer.bio/user/${this.ethAddress}`).then((res: any) => res.json());
        const topProfileSet = new Set<string>();
        const rangeProfileSet = new Set<string>();

        res.top.forEach((element: { address: string }, index: number) => {
            if (index < 3) {
                topProfileSet.add(element.address);
            }
        });

        res.range.forEach((element: { address: string }) => {
            rangeProfileSet.add(element.address);
        });
        const [topThree, range] = await Promise.all([
            RSS3.getAPIUser().persona.profile.getList(Array.from(topProfileSet)),
            RSS3.getAPIUser().persona.profile.getList(Array.from(rangeProfileSet)),
        ]);
        console.log(topThree);
        console.log(range);

        this.topThree = topThree
            .map((profile) => {
                return {
                    ...profile,
                    score: res.top.find((element) => element.address === profile.persona).score,
                };
            })
            .sort((a, b) => b.score - a.score);
        this.range = range
            .map((profile) => {
                return {
                    ...profile,
                    score: res.top.find((element) => element.address === profile.persona).score,
                };
            })
            .sort((a, b) => b.score - a.score);
    }
}
</script>

<style></style>
