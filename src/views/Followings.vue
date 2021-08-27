<template>
    <div class="main px-4 py-8 max-w-md m-auto">
        <div class="header flex justify-between items-center pb-4">
            <Button size="sm" class="w-10 h-10 bg-white text-primary shadow-secondary" @click="back">
                <i class="bx bx-chevron-left bx-sm"></i>
            </Button>
            <div class="section-title text-2xl text-primary font-bold text-center">Followings</div>
            <ImgHolder
                class="w-10 h-10 inline-flex my-auto cursor-pointer"
                :is-rounded="true"
                :is-border="false"
                :src="this.rss3Profile.avatar"
                :alt="this.rss3Profile.username"
                @click="toPublicPage(this.rss3Profile.address)"
            />
        </div>
        <div class="follow-list flex flex-col gap-y-2">
            <FollowerCard
                class="w-auto shadow-secondary cursor-pointer"
                v-for="(item, index) in followingList"
                :key="index"
                :avatar="item.avatar"
                :name="item.username"
                :address="item.address"
                @click="toPublicPage(item.address)"
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

interface Profile {
    avatar: string;
    username: string;
    address: string;
    bio: string;
}

@Options({
    components: { ImgHolder, Button, FollowerCard },
})
export default class Followings extends Vue {
    public followingList: Array<Object> = [];
    public rss3Profile: Profile = {
        avatar: '',
        username: '',
        address: '',
        bio: '',
    };

    async mounted() {
        const address: string = <string>this.$route.params.address;
        const rss3 = await RSS3.visitor();
        const profile = await rss3.profile.get(address);
        const followersList = (await rss3.links.get(address, 'following'))?.list || [];

        this.rss3Profile.avatar = profile?.avatar?.[0] || '';
        this.rss3Profile.username = profile?.name || '';
        this.rss3Profile.address = address;

        if (rss3 && followersList) {
            for (const item of followersList) {
                const profile = await rss3.profile.get(item);
                this.followingList.push({
                    avatar: profile?.avatar?.[0] || '',
                    username: profile?.name || '',
                    address: item,
                });
            }
        }
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
