<template>
    <div class="profile-container grid grid-cols-3 md:grid-cols-4 gap-2 items-center">
        <ImgHolder
            class="col-span-1 md:row-span-3 w-24 h-24 md:w-40 md:h-40"
            :is-rounded="true"
            :is-border="false"
            :src="avatar"
        />
        <div class="stats-container leading-5 md:row-start-3 md:col-start-2" @click="toFollowersPage">
            <div class="stats-number">
                {{ followers }}
            </div>
            <div class="stats-type">Followers</div>
        </div>
        <div class="stats-container leading-5 md:row-start-3 md:col-start-3" @click="toFollowingsPage">
            <div class="stats-number">
                {{ followings }}
            </div>
            <div class="stats-type">Followings</div>
        </div>
        <span class="col-span-full row-start-2 md:row-start-1 md:col-start-2 md:col-span-2 font-bold text-2xl">{{
            username
        }}</span>
        <section
            class="
                col-span-3
                md:col-start-2 md:row-start-2
                row-start-3
                flex flex-col
                md:flex-row
                gap-y-2 gap-x-10
                justify-start
                items-start
                md:items-center
            "
        >
            <LinkButton class="relative" @click="emitClickAddress">
                <span v-if="rns">{{ rns }}{{ suffix }}</span>
                <span v-else>{{ filter(address) }}</span>
                <Tooltip v-show="isShowingTooltip" text="Copied" viewOption="default" />
            </LinkButton>
            <LinkButton @click="toExternalLink" v-if="website && !isLoadingPersona">
                <i class="bx bx-link" />
                <span>{{ website }}</span>
            </LinkButton>
            <div class="flex-1 flex flex-row scrollbar-hide max-h-5 flex-shrink" v-if="!isLoadingPersona">
                <slot name="Accounts" />
            </div>
        </section>
        <div class="bio col-span-full md:order-5 font-normal text-lg whitespace-pre-line">
            {{ bio }}
        </div>
        <div class="col-span-full md:col-span-1 md:col-start-4 md:row-start-1">
            <slot name="Toolbar" />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ImgHolder from '@/components/ImgHolder.vue';
import LinkButton from '@/components/LinkButton.vue';
import config from '@/config';
import Tooltip from '@/components/Tooltip.vue';

@Options({
    components: { Tooltip, ImgHolder, LinkButton },
    props: {
        avatar: String,
        username: String,
        address: String,
        followers: Number,
        followings: Number,
        website: String,
        bio: String,
        rns: String,
        isLoadingPersona: Boolean,
    },
    emits: ['clickAddress'],
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

    toExternalLink() {
        const normalizedLink = (this.website.includes('://') ? '' : 'https://') + this.website;
        window.open(normalizedLink);
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
