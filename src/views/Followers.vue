<template>
    <div class="main px-4 py-8 max-w-md m-auto">
        <div class="header flex justify-between items-center pb-4">
            <Button size="sm" class="w-10 h-10 bg-white text-primary shadow-secondary" @click="back">
                <i class="bx bx-chevron-left bx-sm"></i>
            </Button>
            <div class="section-title text-2xl text-primary font-bold text-center">Followers</div>
            <ImgHolder
                class="w-10 h-10 inline-flex my-auto cursor-pointer"
                :is-rounded="true"
                :is-border="false"
                :src="this.rss3Profile.avatar"
                :alt="this.rss3Profile.username"
                @click="toPublicPage(this.rns || this.ethAddress)"
            />
        </div>
        <div class="follow-list flex flex-col gap-y-2">
            <FollowerCard
                class="w-auto cursor-pointer"
                v-for="(item, index) in followerList"
                :key="index"
                :avatar="item.avatar"
                :name="item.username"
                :address="item.rns || item.displayAddress"
                @click="toPublicPage(item.rns || item.address)"
            />
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

interface Profile {
    avatar: string;
    username: string;
    address: string;
    bio: string;
    rns: string;
    displayAddress: string;
}

@Options({
    components: { ImgHolder, Button, FollowerCard },
})
export default class Followers extends Vue {
    public followerList: Array<Object> = [];
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

    async mounted() {
        const address = <string>this.$route.params.address;
        if (!address.startsWith('0x')) {
            this.rns = address;
            this.ethAddress = (await RNSUtils.name2Addr(`${address}.pass3.me`)).toString();
        } else {
            this.ethAddress = address;
            this.rns = (await RNSUtils.addr2Name(address)).toString();
        }
        const rss3 = await RSS3.visitor();
        const profile = await rss3.profile.get(this.ethAddress);
        const followersList = await rss3.backlinks.get(this.ethAddress, 'following');

        this.rss3Profile.avatar = profile?.avatar?.[0] || config.defaultAvatar;
        this.rss3Profile.username = profile?.name || '';
        this.rss3Profile.address = this.ethAddress;

        if (rss3 && followersList) {
            for (const item of followersList) {
                const profile = await rss3.profile.get(item);
                this.followerList.push({
                    avatar: profile.avatar?.[0] || '',
                    username: profile.name || '',
                    address: item,
                    displayAddress: this.filter(item),
                    rns: (await RNSUtils.addr2Name(item)).toString().replace('.pass3.me', ''),
                });
            }
        }
    }

    filter(address: string) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    public toPublicPage(address: string) {
        this.$router.push(`/${address}`);
    }

    public back() {
        window.history.back();
    }
}
</script>

<style></style>
