<template>
    <div class="profile-container grid grid-cols-3 md:grid-cols-4 items-center md:justify-start gap-2">
        <div class="col-span-1 md:row-span-3 w-24 h-24 md:w-40 md:h-40">
            <ImgHolder class="w-24 h-24 md:w-40 md:h-40" :is-rounded="true" :is-border="false" :src="avatar" />
        </div>
        <div class="col-span-1 md:order-2 stats-container leading-5" @click="toFollowersPage">
            <div class="stats-number">
                {{ followers.length }}
            </div>
            <div class="stats-type">Followers</div>
        </div>
        <div class="col-span-1 md:order-2 stats-container leading-5" @click="toFollowingsPage">
            <div class="stats-number">
                {{ followings.length }}
            </div>
            <div class="stats-type">Followings</div>
        </div>
        <span class="col-span-full md:col-span-2 md:order-0 font-bold text-2xl">{{ username }}</span>
        <div @click="emitClickAddress" class="col-span-full md:col-span-1 md:row-start-3 md:col-start-2 inline-block">
            <LinkButton class="relative">
                <span v-if="rns">{{ rns }}{{ suffix }}</span>
                <span v-else>{{ filter(address) }}</span>
                <Tooltip v-show="isShowingTooltip" :text="$props.clickAddressNotice" view-type="options" />
            </LinkButton>
        </div>
        <div class="col-span-full md:col-span-2 md:row-start-3 md:col-start-3" v-if="website">
            <LinkButton @click="toExternalLink">
                <span>{{ website }}</span>
            </LinkButton>
        </div>
        <div class="bio col-span-full md:order-5 md:my-2 font-medium text-lg whitespace-pre-line">
            {{ bio }}
        </div>
        <div class="col-span-full md:col-span-1 md:col-start-4 md:row-start-1">
            <Button
                size="sm"
                class="w-full text-lg mb-4 md:m-0 duration-200"
                v-if="!isOwner"
                v-bind:class="[
                    isFollowing
                        ? 'bg-secondary-btn text-secondary-btn-text shadow-secondary-btn'
                        : 'bg-primary-btn text-primary-btn-text shadow-primary-btn',
                ]"
                @click="emitAction"
            >
                <span>{{ isFollowing ? 'Following' : 'Follow' }}</span>
                <i class="bx bx-sm no-underline" v-bind:class="[isFollowing ? 'bx-check' : 'bx-plus']"></i>
            </Button>

            <div class="flex mb-4 h-13 gap-2 mt-2 md:m-0" v-else>
                <Button
                    size="lg"
                    class="text-lg bg-secondary-btn text-secondary-btn-text shadow-secondary-btn flex-1 truncate"
                    @click="emitSetUp"
                >
                    <span>Edit Profile</span>
                    <i class="bx bx-pencil bx-sm"></i>
                </Button>
                <Button
                    size="lg"
                    class="w-13 text-lg bg-primary-btn text-primary-btn-text shadow-primary-btn"
                    @click="emitLogout"
                >
                    <i class="bx bx-log-out bx-sm"></i>
                </Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ImgHolder from '@/components/ImgHolder.vue';
import LinkButton from '@/components/LinkButton.vue';
import Vue3Autocounter from 'vue3-autocounter';
import config from '@/config';
import Tooltip from '@/components/Tooltip.vue';
import Button from '@/components/Button.vue';

@Options({
    components: { Tooltip, ImgHolder, Vue3Autocounter, LinkButton, Button },
    props: {
        avatar: String,
        username: String,
        address: String,
        followers: Array,
        followings: Array,
        website: String,
        bio: String,
        rns: String,
        clickAddressNotice: String,
        isOwner: Boolean,
        isFollowing: Boolean,
    },
    emits: ['share', 'clickAddress', 'action', 'toSetupPage', 'logout'],
})
export default class Profile extends Vue {
    address!: String;
    rns!: String;
    website!: String;
    suffix: string = '.' + config.subDomain.rootDomain;
    isShowingTooltip: boolean = false;
    isOwner!: Boolean;
    isFollowing!: Boolean;

    toFollowersPage() {
        this.$router.push((config.subDomain.isSubDomainMode ? '' : `/${this.rns || this.address}`) + `/followers`);
    }
    toFollowingsPage() {
        this.$router.push((config.subDomain.isSubDomainMode ? '' : `/${this.rns || this.address}`) + `/followings`);
    }

    filter(address: string) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    toNFTsPage() {
        this.$router.push(`/${this.rns || this.address}/nfts`);
    }

    toExternalLink() {
        window.open(`${this.website}`);
    }

    emitShare() {
        this.$emit('share');
    }

    emitAction() {
        this.$emit('action');
    }

    emitSetUp() {
        this.$emit('toSetupPage');
    }

    emitLogout() {
        this.$emit('logout');
    }

    emitClickAddress() {
        this.$emit('clickAddress');
        this.isShowingTooltip = true;
        setTimeout(() => {
            this.isShowingTooltip = false;
        }, 2000);
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
