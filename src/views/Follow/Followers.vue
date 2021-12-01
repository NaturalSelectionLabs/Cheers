<template>
    <div class="h-screen bg-body-bg overflow-y-auto">
        <div class="m-auto pb-20 pt-8 px-4 max-w-screen-lg">
            <Header :ethAddress="ethAddress" :rns="rns" :rss3Profile="rss3Profile" title="Followers" theme="primary" />
            <div class="flex flex-col gap-y-4 m-auto max-w-md">
                <FollowerCard
                    class="w-auto cursor-pointer"
                    v-for="item in followerList"
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
import RNSUtils from '@/common/rns';
import config from '@/config';
import { reverse } from 'lodash';
import setupTheme from '@/common/theme';
import utils from '@/common/utils';
import { Profile } from '@/common/types';
import { RSS3Profile } from 'rss3-next/types/rss3';
import Header from '@/components/Common/Header.vue';

@Options({
    name: 'Followers',
    components: { ImgHolder, Button, FollowerCard, Header },
})
export default class Followers extends Vue {
    followerList: Array<Profile> = [];
    rss3Profile: RSS3Profile = {};
    rns: string = '';
    ethAddress: string = '';
    lastRoute: string = '';
    isPageActive: boolean = false;
    loadingNo: number = 0;

    async initLoad() {
        this.lastRoute = this.$route.fullPath;
        this.followerList = [];
        this.loadingNo = 0;

        const rss3 = await RSS3.visitor();
        const initFollowersList = await rss3.backlinks.get(this.ethAddress, 'following');
        const followersList = reverse(initFollowersList);

        if (rss3 && followersList) {
            for (const item of followersList) {
                this.followerList.push({
                    avatar: config.defaultAvatar,
                    username: '',
                    bio: '',
                    address: item,
                    displayAddress: this.filter(item),
                    rns: '',
                });
            }
            setTimeout(() => {
                this.loadDetails(rss3);
            }, 0);
        }

        // Setup theme
        setupTheme(await rss3.assets.get(this.ethAddress));
    }

    async loadDetails(rss3: IRSS3) {
        const startNo = this.loadingNo;
        const endNo = this.followerList.length;
        for (let i = startNo; i < endNo; i++) {
            if (this.isPageActive) {
                const item = this.followerList[i];
                try {
                    const profile = (await rss3.profile.get(item.address)) || {};
                    item.avatar = profile.avatar?.[0] || config.defaultAvatar;
                    item.username = profile.name || '';
                    item.bio = profile.bio || '';
                    item.rns = await RNSUtils.addr2Name(item.address);
                } catch (e) {
                    console.log(item, e);
                }
                this.loadingNo = i;
            }
        }
    }

    async setProfile() {
        const rss3 = await RSS3.visitor();
        this.rss3Profile = await rss3.profile.get(this.ethAddress);
    }

    async setPageTitleFavicon() {
        const rss3 = await RSS3.visitor();
        const profile = await rss3.profile.get(this.ethAddress);
        const favicon = <HTMLLinkElement>document.getElementById('favicon');
        favicon.href = profile?.avatar?.[0] || '/favicon.ico';
        document.title = profile?.name || 'Web3 Pass';
    }

    filter(address: string) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    async activated() {
        this.isPageActive = true;

        const { ethAddress, rns } = await utils.getAddress(<string>this.$route.params.address);
        this.ethAddress = ethAddress;
        this.rns = rns;

        setTimeout(async () => {
            await this.setPageTitleFavicon();
            if (this.lastRoute !== this.$route.fullPath) {
                await this.setProfile();
                await this.initLoad();
            } else if (this.loadingNo < this.followerList.length) {
                await this.loadDetails(await RSS3.visitor());
            }
        }, 0);
    }

    async deactivated() {
        this.isPageActive = false;
    }

    async toPublicPage(rns: string, ethAddress: string) {
        if (rns) {
            window.location.href = `//${rns}.${config.subDomain.rootDomain}`;
        } else {
            window.location.href = `//${config.subDomain.rootDomain}/${ethAddress}`;
        }
    }
}
</script>

<style></style>
