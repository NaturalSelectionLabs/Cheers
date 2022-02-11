<template>
    <div class="h-screen text-body-text overflow-y-auto">
        <div class="m-auto pb-20 pt-8 px-4 max-w-screen-lg">
            <Header />
            <TransBarCard
                :title="(rss3Profile.name ? rss3Profile.name + `'s ` : '') + 'Followers'"
                :have-details="true"
            >
                <template #details>
                    <div class="flex flex-col gap-y-4 m-auto mt-2 w-full md:mt-4">
                        <FollowCard
                            class="w-auto cursor-pointer"
                            v-for="item in followRenderList"
                            :key="item.address"
                            :avatar="item.avatar"
                            :name="item.username"
                            :bio="item.bio"
                            :rns="item.rns"
                            :address="item.address"
                            @click="toPublicPage(item.address, item.rns)"
                        />
                    </div>
                    <IntersectionObserverContainer
                        v-if="isHavingMoreFollows"
                        :once="false"
                        :enabled="!isLoadingFollows"
                        @trigger="loadMoreFollows"
                    >
                        <div class="flex gap-2 items-start justify-center">
                            <span class="font-light">One moment </span>
                            <LoadingSmile :size="18" :isLooping="true" />
                        </div>
                    </IntersectionObserverContainer>
                    <div
                        v-if="!isLoadingFollows && followRenderList.length === 0"
                        class="flex flex-row gap-2 items-end justify-center"
                    >
                        <span class="font-light">
                            Looks like this user hasn't got a shot.<br />
                            Come back and check it out later
                        </span>
                        <Smile :size="18" class="mb-1" />
                    </div>
                </template>
            </TransBarCard>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import ImgHolder from '@/components/Common/ImgHolder.vue';
import FollowCard from '@/components/Follow/FollowCard.vue';
import RSS3, { IRSS3 } from '@/common/rss3';
import RNS from '@/common/rns';
import legacyConfig from '@/config';
import config from '@/common/config';
import utils from '@/common/utils';
import { Profile } from '@/common/types';
import Header from '@/components/Common/Header.vue';
import IntersectionObserverContainer from '@/components/Common/IntersectionObserverContainer.vue';
import TransBarCard from '@/components/Card/TransBarCard.vue';
import LoadingSmile from '@/components/Loading/LoadingSmile.vue';

@Options({
    name: 'Followers',
    components: {
        TransBarCard,
        IntersectionObserverContainer,
        ImgHolder,
        Button,
        FollowCard,
        Header,
        LoadingSmile,
    },
})
export default class Followers extends Vue {
    followRenderList: Profile[] = [];
    rss3Profile: RSS3Profile = {};
    lastRoute: string = '';
    isPageActive: boolean = false;
    loadingNo: number = 0;
    followList: string[] = [];
    followStartIndex: number = 0;
    isHavingMoreFollows: boolean = true;
    isLoadingFollows: boolean = true;

    async initLoad() {
        this.lastRoute = this.$route.fullPath;
        this.followRenderList = [];
        this.loadingNo = 0;

        const addrOrName = utils.getAddress(<string>this.$route.params.address);
        const pageOwner = await RSS3.setPageOwner(addrOrName);

        utils.subDomainModeRedirect(pageOwner.name);

        if (pageOwner.profile) {
            this.rss3Profile = pageOwner.profile;
        }

        this.followList = Array.from(new Set(pageOwner.followers)).reverse();

        this.isLoadingFollows = false;
        await this.loadMoreFollows();
    }

    async loadMoreFollows() {
        // Get profile
        if (!this.isLoadingFollows) {
            this.isLoadingFollows = true;
            const apiUser = RSS3.getAPIUser().persona as IRSS3;

            let endIndex = this.followStartIndex + config.splitPageLimits.follows;
            if (endIndex > this.followList.length) {
                endIndex = this.followList.length;
                this.isHavingMoreFollows = false;
            }

            const profiles = await apiUser.profile.getList(this.followList.slice(this.followStartIndex, endIndex));

            for (const profile of profiles) {
                const { extracted } = utils.extractEmbedFields(profile.bio || '', []);
                this.followRenderList.push({
                    avatar: profile.avatar?.[0] || legacyConfig.defaultAvatar,
                    username: profile.name || '',
                    bio: extracted,
                    address: profile.persona,
                    rns: '',
                });
            }
            this.followStartIndex = endIndex;
            this.startLoadRNS();
            this.isLoadingFollows = false;
        }
    }

    startLoadRNS() {
        setTimeout(() => {
            this.loadRNS();
        }, 0);
    }

    async loadRNS() {
        const startNo = this.loadingNo;
        const endNo = this.followRenderList.length;
        const indexList = Array.from(new Array(endNo).keys()).slice(startNo);
        this.loadingNo = endNo;
        await Promise.all(
            indexList.map(async (index) => {
                const item = this.followRenderList[index];
                try {
                    item.rns = await RNS.addr2Name(item.address);
                } catch (e) {
                    console.log(item, e);
                }
            }),
        );
    }

    async activated() {
        this.isPageActive = true;

        setTimeout(async () => {
            if (this.lastRoute !== this.$route.fullPath) {
                await this.initLoad();
            } else if (this.loadingNo < this.followRenderList.length) {
                await this.loadRNS();
            }
        }, 0);
    }

    async deactivated() {
        this.isPageActive = false;
    }

    toPublicPage(ethAddress: string, rns?: string) {
        if (rns) {
            window.location.href = `//${rns}.${legacyConfig.subDomain.rootDomain}`;
        } else {
            window.location.href = `//${legacyConfig.subDomain.rootDomain}/${ethAddress}`;
        }
    }
}
</script>

<style></style>
