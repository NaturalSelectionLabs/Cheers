<template>
    <div class="h-screen bg-gradient-to-tr from-blue-400 to-blue-200 via-blue-100">
        <div class="h-full overflow-y-auto">
            <div class="m-auto pb-20 pt-8 px-4 max-w-screen-lg">
                <Header :ethAddress="ethAddress" :rns="rns" :rss3Profile="rss3Profile" title="Followings" />
                <TransBarCard
                    :title="(rss3Profile.name ? rss3Profile.name + `'s ` : '') + 'Followings'"
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
                                @click="toPublicPage(item.rns, item.address)"
                            />
                        </div>
                        <IntersectionObserverContainer
                            v-if="isHavingMoreFollows"
                            :once="false"
                            :enabled="!isLoadingFollows"
                            @trigger="loadMoreFollows"
                        >
                            <Button
                                size="sm"
                                class="w-full h-6 text-content-btn-s-text bg-content-btn-s shadow-content-btn-s"
                                @click="loadMoreFollows"
                            >
                                <i v-if="isLoadingFollows" class="bx bx-loader-circle bx-spin"></i>
                                <i v-else class="bx bx-dots-horizontal-rounded" />
                            </Button>
                        </IntersectionObserverContainer>
                    </template>
                </TransBarCard>
            </div>
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
import { reverse, uniq } from 'lodash';
import utils from '@/common/utils';
import { Profile } from '@/common/types';
import Header from '@/components/Common/Header.vue';
import IntersectionObserverContainer from '@/components/Common/IntersectionObserverContainer.vue';
import TransBarCard from '@/components/Card/TransBarCard.vue';

@Options({
    name: 'Followings',
    components: { TransBarCard, IntersectionObserverContainer, ImgHolder, Button, FollowCard, Header },
})
export default class Followings extends Vue {
    followRenderList: Profile[] = [];
    rss3Profile: RSS3Profile = {};
    rns: string = '';
    ethAddress: string = '';
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

        this.ethAddress = pageOwner.address;
        this.rns = pageOwner.name;

        utils.subDomainModeRedirect(this.rns);

        if (pageOwner.profile) {
            this.rss3Profile = pageOwner.profile;
        }

        this.followList = reverse(uniq(pageOwner.followings));

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
                    avatar: profile.avatar?.[0] || config.undefinedImageAlt,
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
        for (let i = startNo; i < endNo; i++) {
            if (this.isPageActive) {
                const item = this.followRenderList[i];
                try {
                    item.rns = await RNS.addr2Name(item.address);
                } catch (e) {
                    console.log(item, e);
                }
                this.loadingNo = i;
            }
        }
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

    async toPublicPage(rns: string, ethAddress: string) {
        if (rns) {
            window.location.href = `//${rns.replace(/\.rss3$/, '')}.${legacyConfig.subDomain.rootDomain}`;
        } else {
            window.location.href = `//${legacyConfig.subDomain.rootDomain}/${ethAddress}`;
        }
    }
}
</script>

<style></style>
