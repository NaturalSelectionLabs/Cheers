<template>
    <div class="h-screen bg-body-bg overflow-y-auto">
        <div class="px-4 pt-8 pb-20 max-w-md m-auto">
            <div class="header flex justify-between items-center pb-4">
                <Button
                    size="sm"
                    class="w-10 h-10 bg-secondary-btn text-secondary-btn-text shadow-secondary-btn"
                    @click="back"
                >
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
                <div class="section-title text-2xl text-primary-text font-bold text-center">Followings</div>
                <ImgHolder
                    class="w-10 h-10 inline-flex my-auto cursor-pointer"
                    :is-rounded="true"
                    :is-border="false"
                    :src="rss3Profile.avatar"
                    :alt="rss3Profile.username"
                    @click="toPublicPage(rns || ethAddress)"
                />
            </div>
            <div class="follow-list flex flex-col gap-y-4">
                <FollowerCard
                    class="w-auto cursor-pointer"
                    v-for="item in followingList"
                    :key="item.address"
                    :avatar="item.avatar"
                    :name="item.username"
                    :address="item.rns || item.displayAddress"
                    @click="toPublicPage(item.rns || item.address)"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import ImgHolder from '@/components/ImgHolder.vue';
import FollowerCard from '@/components/FollowerCard.vue';
import RSS3 from '@/common/rss3';
import RNSUtils from '@/common/rns';
import config from '@/config';
import * as _ from 'lodash';

interface Profile {
    avatar: string;
    username: string;
    address: string;
    bio: string;
    rns: string;
    displayAddress: string;
}

@Options({
    name: 'Followings',
    components: { ImgHolder, Button, FollowerCard },
})
export default class Followings extends Vue {
    public followingList: Array<Profile> = [];
    public rss3Profile: Profile = {
        avatar: config.defaultAvatar,
        username: '',
        address: '',
        bio: '',
        rns: '',
        displayAddress: '',
    };
    rns: string = '';
    ethAddress: string = '';
    lastRoute: string = '';

    async mounted() {
        await this.initLoad();
    }

    async initLoad() {
        this.lastRoute = this.$route.fullPath;
        this.followingList = [];
        this.rss3Profile.avatar = config.defaultAvatar;

        const address = <string>this.$route.params.address;
        if (!address.startsWith('0x')) {
            this.rns = address;
            this.ethAddress = (await RNSUtils.name2Addr(address + config.rns.suffix)).toString();
        } else {
            this.ethAddress = address;
            this.rns = await RNSUtils.addr2Name(address);
        }
        const rss3 = await RSS3.visitor();
        const profile = await rss3.profile.get(this.ethAddress);
        const initFollowersList = (await rss3.links.get(this.ethAddress, 'following'))?.list || [];
        const followersList = _.reverse(initFollowersList);

        this.rss3Profile.avatar = profile?.avatar?.[0] || config.defaultAvatar;
        this.rss3Profile.username = profile?.name || '';
        this.rss3Profile.address = this.ethAddress;

        // Setup theme
        const themes = RSS3.getAvailableThemes(await rss3.assets.get(this.ethAddress));
        if (themes[0]) {
            document.body.classList.add(themes[0].class);
        } else {
            document.body.classList.remove(...document.body.classList);
        }

        if (rss3 && followersList) {
            for (const item of followersList) {
                try {
                    const profile = await rss3.profile.get(item);
                    this.followingList.push({
                        avatar: profile?.avatar?.[0] || config.defaultAvatar,
                        username: profile?.name || '',
                        bio: profile.bio || '',
                        address: item,
                        displayAddress: this.filter(item),
                        rns: '',
                    });
                } catch (e) {
                    console.log(item, e);
                }
            }
            setTimeout(async () => {
                for (const item of this.followingList) {
                    item.rns = (await RNSUtils.addr2Name(item.address)).replace(config.rns.suffix, '');
                }
            });
        }
    }

    filter(address: string) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    public toPublicPage(address: string) {
        this.$router.push(`/${address}`);
    }

    public back() {
        this.$router.push(`/${this.rns || this.ethAddress}`);
    }

    activated() {
        if (this.lastRoute !== this.$route.fullPath) {
            this.initLoad();
        }
    }
}
</script>

<style></style>
