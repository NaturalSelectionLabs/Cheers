<template>
    <div class="profile-container flex flex-col justify-start items-center gap-y-1">
        <ImgHolder class="w-24 h-24" :is-rounded="true" :is-border="false" :src="avatar" />
        <span class="username font-bold text-2xl">{{ username }}</span>
        <span class="address font-medium text-lg"> {{ filter(address) }} </span>
        <div class="relations font-medium text-lg flex flex-row justify-center items-center gap-x-4 text-primary">
            <div class="followers cursor-pointer" @click="toFollowersPage">{{ followers.length }} followers</div>
            <div class="followings cursor-pointer" @click="toFollowingsPage">{{ followings.length }} followings</div>
        </div>
        <div class="bio w-full font-medium text-lg px-5 break-all">{{ bio }}</div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ImgHolder from '@/components/ImgHolder.vue';

@Options({
    components: { ImgHolder },
    props: {
        avatar: String,
        username: String,
        address: String,
        followers: Array,
        followings: Array,
        bio: String,
    },
})
export default class Profile extends Vue {
    address!: String;
    /**
     * filter
     */
    public filter(address: string) {
        let res: string = address.slice(0, 6);
        res += '....';
        res += address.slice(-4);
        return res;
    }
    public toFollowersPage() {
        this.$router.push(`/${this.address}/followers`);
    }
    public toFollowingsPage() {
        this.$router.push(`/${this.address}/followings`);
    }
}
</script>

<style></style>
