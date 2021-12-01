<template>
    <div class="header flex items-center justify-between pb-4">
        <Button size="sm" class="w-10 h-10 text-secondary-btn-text bg-secondary-btn shadow-secondary-btn" @click="back">
            <i class="bx bx-chevron-left bx-sm" />
        </Button>
        <div class="section-title text-center font-bold" :class="getTitleStyle()" v-if="title">
            {{ title }}
        </div>
        <ImgHolder
            class="inline-flex my-auto w-10 h-10"
            :class="{ 'cursor-pointer': rns && ethAddress }"
            :is-rounded="true"
            :is-border="false"
            :src="avatar || rss3Profile.avatar || defaultAvatar"
            :alt="rss3Profile?.username || ''"
            @click="toPublicPage(rns, ethAddress)"
        />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import ImgHolder from '@/components/Common/ImgHolder.vue';
import { RSS3Profile } from 'rss3-next/types/rss3';
import config from '@/config';

const TitleColor = new Map([
    ['primary', 'text-primary-text'],
    ['account', 'text-account-title'],
    ['nft', 'text-nft-title'],
    ['gitcoin', 'text-gitcoin-title'],
    ['footprint', 'text-footprint-title'],
]);

@Options({
    name: 'Header',
    components: { ImgHolder, Button },
    props: {
        avatar: String,
        rss3Profile: Object,
        title: String,
        theme: String,
        ethAddress: String,
        rns: String,
        list: String,
    },
})
export default class Header extends Vue {
    avatar!: string;
    rss3Profile!: RSS3Profile;
    title!: string;
    theme!: string;
    ethAddress!: string;
    rns!: string;
    list!: string;
    defaultAvatar = config.defaultAvatar;

    back() {
        if (window.history.state.back) {
            window.history.back();
        } else {
            if (this.list) {
                this.$router.push(
                    config.subDomain.isSubDomainMode ? '/' : `/${this.rns || this.ethAddress}` + `/${this.list}`,
                );
            } else {
                this.$router.push(config.subDomain.isSubDomainMode ? '/' : `/${this.rns || this.ethAddress}`);
            }
        }
    }

    toPublicPage(rns: string, ethAddress: string) {
        if (rns && ethAddress) {
            if (rns && config.subDomain.isSubDomainMode) {
                this.$router.push('/');
            } else {
                this.$router.push(`/${rns || ethAddress}`);
            }
        }
    }

    getTitleStyle() {
        let style = '';
        style += TitleColor.get(this.theme) + ' ';
        style += this.title.includes('Manage') ? 'text-xl' : 'text-2xl';
        return style;
    }
}
</script>

<style></style>
