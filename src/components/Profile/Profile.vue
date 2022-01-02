<template>
    <div class="flex flex-col items-center p-4 bg-white bg-opacity-50 border-card rounded-xl box-border md:p-6">
        <div
            class="
                profile-container
                grid
                gap-x-6 gap-y-2
                grid-cols-3
                content-center
                items-center
                w-full
                md:gap-x-0 md:grid-cols-4
            "
        >
            <ImgHolder
                class="h-22 col-span-1 w-22 md:row-span-3 md:w-40 md:h-40"
                :is-rounded="true"
                :is-border="false"
                :src="avatar"
            />
            <div
                class="stats-container row-span-1 self-end ml-2 leading-5 md:col-start-2 md:row-start-3 md:ml-0"
                @click="toFollowersPage"
            >
                <div class="stats-number">
                    {{ followers }}
                </div>
                <div class="stats-type">Followers</div>
            </div>
            <div
                class="stats-container row-span-1 self-end leading-5 md:col-start-3 md:row-start-3"
                @click="toFollowingsPage"
            >
                <div class="stats-number">
                    {{ followings }}
                </div>
                <div class="stats-type">Followings</div>
            </div>
            <span
                class="col-span-full row-start-2 text-2xl font-semibold md:col-span-2 md:col-start-2 md:row-start-1"
                >{{ username }}</span
            >
            <section
                class="
                    flex flex-col
                    gap-x-10 gap-y-2
                    col-span-full
                    row-start-3
                    items-start
                    justify-start
                    md:flex-row md:col-start-2 md:row-start-2 md:items-center
                "
            >
                <div class="scrollbar-hide flex flex-row gap-x-2 w-full whitespace-nowrap overflow-auto">
                    <LinkButton @click="emitClickAddress">
                        <transition name="tip-fade" mode="out-in">
                            <span v-if="isShowingTooltip">Copied</span>
                            <span v-else>{{ rns ? rns + suffix : filter(address) }}</span>
                        </transition>
                    </LinkButton>
                    <LinkButton @click="toExternalLink" v-if="website && !isLoadingPersona">
                        <span><i class="bx bx-link align-bottom" />{{ fixWebsiteURI(website) }}</span>
                    </LinkButton>
                </div>
                <div
                    class="scrollbar-hide max-h-5 flex flex-1 flex-row flex-shrink items-center w-full"
                    v-if="!isLoadingPersona"
                >
                    <slot name="Accounts" />
                </div>
            </section>
            <div class="bio col-span-full whitespace-pre-line text-lg font-normal md:order-5">
                {{ bio }}
            </div>
            <div class="col-span-full md:col-span-1 md:col-start-4 md:row-start-1">
                <slot name="Toolbar" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Card from '@/components/Card/Card.vue';
import ImgHolder from '@/components/Common/ImgHolder.vue';
import LinkButton from '@/components/Button/LinkButton.vue';
import config from '@/config';

@Options({
    components: { ImgHolder, LinkButton, Card },
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
@layer components {
    .stats-container {
        @apply mb-2 w-14 text-primary-text cursor-pointer;

        .stats-number {
            @apply text-base font-normal;
        }

        .stats-type {
            @apply text-base font-normal leading-none;
        }
    }

    .tip-fade-enter-active,
    .tip-fade-leave-active {
        transition: opacity 0.5s ease;
    }

    .tip-fade-enter-from,
    .tip-fade-leave-to {
        opacity: 0;
    }
}
</style>
