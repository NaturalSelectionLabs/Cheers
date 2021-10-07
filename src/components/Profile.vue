<template>
    <div class="profile-container flex flex-col justify-start items-start gap-y-2">
        <div class="w-full pr-8 flex flex-row font-medium text-lg justify-between items-end leading-5">
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
        <div @click="emitClickAddress" class="inline-block relative align-middle">
            <LinkButton v-if="rns">
                <span>{{ rns }}{{ suffix }}</span>
            </LinkButton>
            <LinkButton v-else>
                <span>{{ filter(address) }}</span>
            </LinkButton>
            <Tooltip v-show="isShowingTooltip" :text="$props.clickAddressNotice" view-type="options" />
        </div>
        <LinkButton v-if="website">
            <span>{{ website }}</span>
        </LinkButton>
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
import config from '@/config';
import Tooltip from '@/components/Tooltip.vue';

@Options({
    components: { Tooltip, ImgHolder, Vue3Autocounter, LinkButton },
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
    },
    emits: ['share', 'clickAddress'],
})
export default class Profile extends Vue {
    address!: String;
    rns!: String;
    website!: String;
    suffix: string = '.' + config.subDomain.rootDomain;
    isShowingTooltip: boolean = false;

    public toFollowersPage() {
        this.$router.push((config.subDomain.isSubDomainMode ? '' : `/${this.rns || this.address}`) + `/followers`);
    }
    public toFollowingsPage() {
        this.$router.push((config.subDomain.isSubDomainMode ? '' : `/${this.rns || this.address}`) + `/followings`);
    }

    public filter(address: string) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    public toExternalLink() {
        window.open(`${this.website}`);
    }

    emitShare() {
        this.$emit('share');
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
