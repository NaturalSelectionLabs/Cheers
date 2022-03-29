<template>
    <div class="box-border flex flex-col items-center rounded border-card bg-card-bg p-4 md:p-6">
        <div class="grid w-full grid-cols-3 content-center items-center gap-x-6 gap-y-2 md:grid-cols-5">
            <ImgHolder class="col-span-1 col-start-1 h-22 w-22" :is-rounded="true" :is-border="false" :src="avatar" />
            <div
                class="row-span-1 mb-2 ml-2 w-14 cursor-pointer self-end leading-5 md:col-span-1 md:col-start-2"
                @click="toFollowersPage"
            >
                <div class="text-base font-normal">
                    {{ followers }}
                </div>
                <div class="text-base font-normal leading-none">Followers</div>
            </div>
            <div
                class="row-span-1 mb-2 w-14 cursor-pointer self-end leading-5 md:col-span-1 md:col-start-3"
                @click="toFollowingPage"
            >
                <div class="text-base font-normal">
                    {{ following }}
                </div>
                <div class="text-base font-normal leading-none">Following</div>
            </div>
            <span class="col-span-full row-start-2 text-2xl font-semibold">{{ username }}</span>
            <section class="col-span-full row-start-3 flex flex-col items-start justify-start gap-x-10 gap-y-2">
                <div class="flex max-w-full flex-row gap-x-2 overflow-auto whitespace-nowrap scrollbar-hide">
                    <LinkButton @click="emitClickAddress">
                        <transition name="tip-fade" mode="out-in">
                            <span v-if="isShowingTooltip">Copied</span>
                            <span v-else>{{ rns ? rns + suffix : filter(address) }}</span>
                        </transition>
                    </LinkButton>
                    <LinkButton @click="toExternalLink" v-if="website && !isLoadingPersona">
                        <span><i class="bx bx-link mr-1 align-bottom" />{{ fixWebsiteURI(website) }}</span>
                    </LinkButton>
                </div>
                <div class="max-h-5 flex flex-1 shrink flex-row items-center scrollbar-hide" v-if="!isLoadingPersona">
                    <slot name="Accounts" />
                </div>
            </section>
            <div class="bio col-span-full whitespace-pre-line font-normal">
                {{ bio }}
            </div>
            <div class="col-span-full md:col-span-2 md:col-start-4 md:row-span-1 md:row-start-1 md:self-end md:pb-2">
                <slot name="Toolbar" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ImgHolder from '@/components/Common/ImgHolder.vue';
import LinkButton from '@/components/Button/LinkButton.vue';
import config from '@/config';

@Options({
    components: { ImgHolder, LinkButton },
    props: {
        avatar: String,
        username: String,
        address: String,
        followers: Number,
        following: Number,
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
    toFollowingPage() {
        this.$router.push((config.subDomain.isSubDomainMode ? '' : `/${this.rns || this.address}`) + `/following`);
    }

    filter(address: string) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    fixWebsiteURI(website: string) {
        try {
            return decodeURI(website);
        } catch (e) {
            return website;
        }
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
        }, 1500);
    }
}
</script>

<style lang="postcss" scoped>
.tip-fade-enter-active,
.tip-fade-leave-active {
    transition: opacity 0.5s ease;
}

.tip-fade-enter-from,
.tip-fade-leave-to {
    opacity: 0;
}
</style>
