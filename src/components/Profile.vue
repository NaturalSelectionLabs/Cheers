<template>
    <div class="profile-container flex flex-col justify-start items-start gap-y-2">
        <div
            class="
                flex flex-row
                font-medium
                text-lg
                justify-start
                items-end
                text-primary
                gap-x-2
                md:gap-x-8
                leading-5
                px-4
            "
        >
            <div class="w-24 h-24">
                <ImgHolder class="w-24 h-24" :is-rounded="true" :is-border="false" :src="avatar" />
            </div>
            <div class="cursor-pointer mb-4" @click="toFollowersPage">
                <div>{{ followers.length }}</div>
                <div>Followers</div>
            </div>
            <div class="cursor-pointer mb-4" @click="toFollowingsPage">
                <div>{{ followings.length }}</div>
                <div>Followings</div>
            </div>
            <div class="cursor-pointer mb-4" @click="toNFTsPage">
                <div>{{ NFTs }}</div>
                <div>NFTs</div>
            </div>
        </div>
        <span class="font-bold text-2xl px-4">{{ username }}</span>
        <span class="font-medium text-lg rounded-sm px-4 bg-content-bg text-primary" v-if="rns">
            {{ rns + '.pass3.me' }}
        </span>
        <span class="font-medium text-lg rounded-sm px-4 bg-content-bg text-primary" v-else>
            {{ filter(address) }}
        </span>
        <span class="font-medium text-lg rounded-sm px-4 bg-content-bg text-primary cursor-pointer" v-if="website">
            {{ website }}
        </span>
        <div class="bio w-full font-medium text-lg break-all px-4">
            <pre>{{ bio }}</pre>
        </div>
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
        NFTs: Number,
        website: String,
        bio: String,
        rns: String,
    },
})
export default class Profile extends Vue {
    address!: String;
    rns!: String;
    website!: String;

    public toFollowersPage() {
        this.$router.push(`/${this.rns || this.address}/followers`);
    }
    public toFollowingsPage() {
        this.$router.push(`/${this.rns || this.address}/followings`);
    }

    public filter(address: string) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    public toNFTsPage() {
        this.$router.push(`/${this.rns || this.address}/nfts`);
    }

    public toExternalLink() {
        window.open(`${this.website}`);
    }
}
</script>

<style></style>
