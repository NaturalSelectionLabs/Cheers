<template>
    <div class="m-auto flex h-screen max-w-screen-lg flex-col overflow-hidden px-4 py-9 text-body-text">
        <Header title="Leaderboard" />
        <div class="m-auto mt-4 flex min-h-0 w-full max-w-screen-sm flex-1 flex-col gap-8">
            <section class="flex flex-col gap-4 p-4">
                <RankingCard
                    v-for="item in topThree"
                    :key="item.address"
                    :avatar="item.avatar?.[0] || getDefaultAvatar(item.address)"
                    :name="item.name || formatter(item.address)"
                    :ranking="`${item.rank}`"
                    :score="item.score"
                    :isTop="true"
                    @click="toPublicPage(item.address)"
                />
            </section>
            <section class="flex flex-col gap-4 overflow-y-auto rounded border-card bg-card-bg p-4">
                <IntersectionObserverContainer
                    v-if="!isInitLoading"
                    :once="false"
                    :enabled="!isLoadingRanking"
                    @trigger="loadMoreUpRanking"
                >
                    <Button size="sm" class="h-6 w-full" @click="loadMoreUpRanking">
                        <i v-if="isLoadingRanking" class="bx bx-loader-circle bx-spin"></i>
                        <i v-else class="bx bx-dots-horizontal-rounded" />
                    </Button>
                </IntersectionObserverContainer>
                <RankingCard
                    v-for="item in range"
                    :key="item.address"
                    :avatar="item.avatar?.[0] || getDefaultAvatar(item.address)"
                    :name="item.name || formatter(item.address)"
                    :ranking="`${item.rank}`"
                    :score="item.score"
                    :isTop="false"
                    :isOwner="item.address === ethAddress"
                    :id="item.address === ethAddress ? 'my-ranking' : undefined"
                    @click="toPublicPage(item.address)"
                />
                <IntersectionObserverContainer
                    v-if="!isInitLoading"
                    :once="false"
                    :enabled="!isLoadingRanking"
                    @trigger="loadMoreDownRanking"
                >
                    <Button size="sm" class="h-6 w-full" @click="loadMoreDownRanking">
                        <i v-if="isLoadingRanking" class="bx bx-loader-circle bx-spin"></i>
                        <i v-else class="bx bx-dots-horizontal-rounded" />
                    </Button>
                </IntersectionObserverContainer>
            </section>
        </div>
        <LoadingContainer v-if="isInitLoading" />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import RankingCard from '@/components/Account/RankingCard.vue';
import Header from '@/components/Common/Header.vue';
import Button from '@/components/Button/Button.vue';
import IntersectionObserverContainer from '@/components/Common/IntersectionObserverContainer.vue';
import utils from '@/common/utils';
import RSS3 from '@/common/rss3';
import RNS from '@/common/rns';
import legacyConfig from '@/config';
import { formatter } from '@/common/address';
import LoadingContainer from '@/components/Loading/LoadingContainer.vue';

@Options({
    name: 'Leaderboard',
    components: { LoadingContainer, Header, RankingCard, Button, IntersectionObserverContainer },
})
export default class Leaderboard extends Vue {
    topThree: any[] = [];
    range: any[] = [];
    isInitLoading: boolean = true;
    isLoadingRanking: boolean = true;
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
        this.isLoadingRanking = true;
        const res = await fetch(`https://raas.cheer.bio/user/${this.ethAddress}`).then((res: any) => res.json());
        const top3ProfileSet = new Set<string>();
        const rangeProfileSet = new Set<string>();

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
        this.isLoadingRanking = false;
        this.isInitLoading = false;
        setTimeout(() => {
            document.getElementById('my-ranking')?.scrollIntoView();
        }, 0);
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

    async loadMoreUpRanking() {
        this.isLoadingRanking = true;
        const index = this.range[0].rank - 1;
        const range = await (
            await fetch(`https://raas.cheer.bio/range?from=${index - 10 > 0 ? index - 10 : 1}&to=${index}`)
        ).json();
        const rangeProfileSet = new Set<string>();
        range.forEach((element: { address: string }) => {
            rangeProfileSet.add(element.address);
        });
        const rangeProfiles = await RSS3.getAPIUser().persona.profile.getList(Array.from(rangeProfileSet));

        this.range = [
            ...range.map((u) => {
                return {
                    ...u,
                    ...rangeProfiles.find((profile) => u.address === profile.persona),
                };
            }),
            ...this.range,
        ];
        this.isLoadingRanking = false;
    }

    async loadMoreDownRanking() {
        this.isLoadingRanking = true;
        const index = this.range[this.range.length - 1].rank + 1;
        const range = await fetch(`https://raas.cheer.bio/range?from=${index}&to=${index + 10}`).then((res: any) =>
            res.json(),
        );
        const rangeProfileSet = new Set<string>();
        range.forEach((element: { address: string }) => {
            rangeProfileSet.add(element.address);
        });
        const rangeProfiles = await RSS3.getAPIUser().persona.profile.getList(Array.from(rangeProfileSet));

        this.range = [
            ...this.range,
            ...range.map((u) => {
                return {
                    ...u,
                    ...rangeProfiles.find((profile) => u.address === profile.persona),
                };
            }),
        ];
        this.isLoadingRanking = false;
    }

    formatter = formatter;
}
</script>

<style></style>
