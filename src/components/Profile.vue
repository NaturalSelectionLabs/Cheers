<template>
    <div class="profile-container flex flex-col justify-start items-center gap-y-1">
        <ImgHolder class="w-24 h-24" :is-rounded="true" :is-border="false" :src="avatar" />
        <span class="username font-bold text-2xl">{{ username }}</span>
        <span class="address font-medium text-lg" v-if="rns"> {{ rns }} </span>
        <span class="address font-medium text-lg" v-else> {{ filter(address) }} </span>
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
        rns: String,
    },
})
export default class Profile extends Vue {
    address!: String;
    rns!: String;
    public toFollowersPage() {
        this.$router.push(`/${this.rns || this.address}/followers`);
    }
    public toFollowingsPage() {
        this.$router.push(`/${this.rns || this.address}/followings`);
    }

    public filter(address: string) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
}
</script>

<style></style>
