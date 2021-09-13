<template>
    <div class="profile-container flex flex-col justify-start items-start gap-y-2">
        <div class="flex flex-row font-medium text-lg justify-start items-end gap-x-2 md:gap-x-8 leading-5 px-4">
            <div class="w-24 h-24">
                <ImgHolder class="w-24 h-24" :is-rounded="true" :is-border="false" :src="avatar" />
            </div>
            <div class="stats-container" @click="toFollowersPage">
                <div class="stats-number">
                    {{ followers.length }}
                </div>
                <div class="stats-type">Followers</div>
            </div>
            <div class="stats-container" @click="toFollowingsPage">
                <div class="stats-number">
                    {{ followings.length }}
                </div>
                <div class="stats-type">Followings</div>
            </div>
        </div>
        <span class="font-bold text-2xl">{{ username }}</span>
        <LinkButton v-if="rns">{{ rns + '.pass3.me' }}</LinkButton>
        <LinkButton v-else>{{ filter(address) }}</LinkButton>
        <LinkButton v-if="website">{{ website }}</LinkButton>
        <div class="bio w-full font-medium text-lg whitespace-pre-line">
            {{ bio }}
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ImgHolder from '@/components/ImgHolder.vue';
import LinkButton from '@/components/LinkButton.vue';
import Vue3Autocounter from 'vue3-autocounter';

@Options({
    components: { ImgHolder, Vue3Autocounter, LinkButton },
    props: {
        avatar: String,
        username: String,
        address: String,
        followers: Array,
        followings: Array,
        website: String,
        bio: String,
        rns: String,
    },
    emits: ['share'],
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

    emitShare() {
        this.$emit('share');
    }
}
</script>

<style lang="postcss" scoped>
@layer components {
    .stats-container {
        @apply cursor-pointer mb-2 text-primary-text;
        .stats-number {
            @apply text-xl font-semibold;
        }

        .stats-type {
            @apply text-base font-normal leading-none;
        }
    }
}
</style>
