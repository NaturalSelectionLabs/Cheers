<template>
    <div class="m-auto max-w-screen-lg px-4 py-9 text-body-text">
        <Header title="Leaderboard" />
        <div class="m-auto mt-4 flex max-w-screen-sm flex-col gap-8">
            <section class="flex flex-col gap-4 p-4">
                <RankingCard
                    v-for="item in topThree"
                    :key="item.address"
                    :avatar="item.avatar || getDefaultAvatar(item.address)"
                    :name="item.name || formatter(item.address)"
                    :ranking="`${item.rank}`"
                    :score="item.score"
                    :isTop="true"
                    @click="toPublicPage(item.address)"
                />
            </section>
            <section class="flex flex-col gap-4 rounded border-card bg-card-bg p-4">
                <RankingCard
                    v-for="item in range"
                    :key="item.address"
                    :avatar="item.avatar || getDefaultAvatar(item.address)"
                    :name="item.name || formatter(item.address)"
                    :ranking="`${item.rank}`"
                    :score="item.score"
                    :isTop="false"
                    :isOwner="item.address === ethAddress"
                    @click="toPublicPage(item.address)"
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
import RNS from '@/common/rns';
import legacyConfig from '@/config';
import { formatter } from '@/common/address';

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
        const top3ProfileSet = new Set<string>();
        const rangeProfileSet = new Set<string>();

        console.log('Raas Res', res);

        const top3 = res.top.sort((a, b) => b.score - a.score).slice(0, 3);
        const range = res.range;

        top3.forEach((element: { address: string }) => {
            top3ProfileSet.add(element.address);
        });
        range.forEach((element: { address: string }) => {
            rangeProfileSet.add(element.address);
        });
        const [top3Profiles, rangeProfiles] = await Promise.all([
            RSS3.getAPIUser().persona.profile.getList(Array.from(top3ProfileSet)),
            RSS3.getAPIUser().persona.profile.getList(Array.from(rangeProfileSet)),
        ]);
        console.log('Top3Profile', top3Profiles);
        console.log('RangeProfile', rangeProfiles);

        this.topThree = top3
            .map((u) => {
                return {
                    ...u,
                    ...top3Profiles.find((profile) => u.address === profile.persona),
                };
            })
            .sort((a, b) => b.score - a.score);
        this.range = range
            .map((u) => {
                return {
                    ...u,
                    ...rangeProfiles.find((profile) => u.address === profile.persona),
                };
            })
            .sort((a, b) => b.score - a.score);
    }

    async toPublicPage(ethAddress: string) {
        const rns = await RNS.addr2Name(ethAddress);
        if (rns) {
            window.location.href = `//${rns}.${legacyConfig.subDomain.rootDomain}`;
        } else {
            window.location.href = `//${legacyConfig.subDomain.rootDomain}/${ethAddress}`;
        }
    }

    getDefaultAvatar(ethAddress: string) {
        return `https://stamp.fyi/avatar/${ethAddress}`;
    }

    formatter = formatter;
}
</script>

<style></style>
