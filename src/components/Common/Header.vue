<template>
    <div class="flex items-center justify-between pb-4">
        <Logo v-if="displayLogo" class="w-10 h-10 cursor-pointer" />
        <div
            v-else
            class="flex items-center justify-center w-10 h-10 text-secondary-btn-text cursor-pointer"
            @click="back"
        >
            <i class="bx bx-chevron-left bx-sm" />
        </div>
        <div class="text-center text-primary-text text-xl font-bold" v-if="title">
            {{ title }}
        </div>
        <ImgHolder
            class="inline-flex my-auto w-10 h-10"
            :class="{ 'cursor-pointer': rns && ethAddress }"
            :is-rounded="true"
            :is-border="false"
            :src="avatar || rss3Profile?.avatar?.[0] || defaultAvatar"
            :alt="rss3Profile?.username || ''"
            @click="toPublicPage(rns, ethAddress)"
        />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import ImgHolder from '@/components/Common/ImgHolder.vue';
import config from '@/config';
import { AnyObject } from 'rss3/types/extend';
import Logo from '@/components/Icons/Logo.vue';

@Options({
    name: 'Header',
    components: { ImgHolder, Button, Logo },
    props: {
        avatar: String,
        rss3Profile: Object,
        title: String,
        ethAddress: String,
        rns: String,
        list: String,
        displayLogo: Boolean,
    },
})
export default class Header extends Vue {
    avatar!: string;
    rss3Profile!: AnyObject;
    title!: string;
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
                    (config.subDomain.isSubDomainMode ? '' : `/${this.rns || this.ethAddress}`) + `/${this.list}`,
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
}
</script>

<style></style>
