<template>
    <div class="h-screen bg-body-bg overflow-y-auto">
        <div class="m-auto pb-20 pt-8 px-4 max-w-screen-lg">
            <Header :ethAddress="ethAddress" :rns="rns" :rss3Profile="rss3Profile" title="Followings" theme="primary" />
            <div class="flex flex-col gap-y-4 m-auto max-w-md">
                <FollowerCard
                    class="w-auto cursor-pointer"
                    v-for="item in followingList"
                    :key="item.address"
                    :avatar="item.avatar"
                    :name="item.username"
                    :address="item.rns || item.displayAddress"
                    @click="toPublicPage(item.rns, item.address)"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import ImgHolder from '@/components/Common/ImgHolder.vue';
import FollowerCard from '@/components/Follow/FollowerCard.vue';
import RSS3, { IRSS3 } from '@/common/rss3';
import RNS from '@/common/rns';
import legacyConfig from '@/config';
import config from '@/common/config';
import { reverse, uniq } from 'lodash';
import utils from '@/common/utils';
import { Profile } from '@/common/types';
import Header from '@/components/Common/Header.vue';

@Options({
    name: 'Followings',
    components: { ImgHolder, Button, FollowerCard, Header },
})
export default class Followings extends Vue {
    followingList: Profile[] = [];
    rss3Profile: RSS3Profile = {};
    rns: string = '';
    ethAddress: string = '';
    lastRoute: string = '';
    isPageActive: boolean = false;
    loadingNo: number = 0;

    async initLoad() {
        this.lastRoute = this.$route.fullPath;
        this.followingList = [];
        this.loadingNo = 0;

        const addrOrName = utils.getAddress(<string>this.$route.params.address);
        const pageOwner = await RSS3.setPageOwner(addrOrName);
        const apiUser = RSS3.getAPIUser().persona as IRSS3;

        this.ethAddress = pageOwner.address;
        this.rns = pageOwner.name;

        if (pageOwner.profile) {
            this.rss3Profile = pageOwner.profile;
        }

        const followingList = pageOwner.followings;

        // Get profile

        if (followingList) {
            const profiles = await apiUser.profile.getList(reverse(uniq(followingList)));

            for (const profile of profiles) {
                const { extracted } = utils.extractEmbedFields(profile.bio || '', []);
                this.followingList.push({
                    avatar: profile.avatar?.[0] || config.undefinedImageAlt,
                    username: profile.name || '',
                    bio: extracted,
                    address: profile.persona,
                    displayAddress: this.filter(profile.persona),
                    rns: '',
                });
            }
            setTimeout(() => {
                this.loadDetails();
            }, 0);
        }
    }

    async loadDetails() {
        const startNo = this.loadingNo;
        const endNo = this.followingList.length;
        for (let i = startNo; i < endNo; i++) {
            if (this.isPageActive) {
                const item = this.followingList[i];
                try {
                    item.rns = await RNS.addr2Name(item.address);
                } catch (e) {
                    console.log(item, e);
                }
                this.loadingNo = i;
            }
        }
    }

    filter(address: string) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    async activated() {
        this.isPageActive = true;

        setTimeout(async () => {
            if (this.lastRoute !== this.$route.fullPath) {
                await this.initLoad();
            } else if (this.loadingNo < this.followingList.length) {
                await this.loadDetails();
            }
        }, 0);
    }

    async deactivated() {
        this.isPageActive = false;
    }

    async toPublicPage(rns: string, ethAddress: string) {
        if (rns) {
            window.location.href = `//${rns}.${legacyConfig.subDomain.rootDomain}`;
        } else {
            window.location.href = `//${legacyConfig.subDomain.rootDomain}/${ethAddress}`;
        }
    }
}
</script>

<style></style>
