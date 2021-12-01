<template>
    <div id="main" class="h-screen bg-gitcoin-bg overflow-y-auto">
        <div class="m-auto pb-32 pt-8 px-4 max-w-screen-lg">
            <Header :ethAddress="ethAddress" :rns="rns" :rss3Profile="rss3Profile" title="Donations" theme="gitcoin" />
            <GitcoinTitle class="mb-6" :grants="grants" :contributions="contribs" />
            <div
                class="gitcoin-gitcoins grid gap-6 grid-cols-1 sm:grid-cols-2"
                :class="{ 'pb-16': isOwner }"
                v-show="gitcoins.length !== 0"
            >
                <GitcoinCard
                    v-for="item in gitcoins"
                    :key="item.platform + item.identity + item.id"
                    :imageUrl="item.info.image_preview_url || defaultAvatar"
                    :name="item.info.title || 'Inactive Project'"
                    :contrib="item.info.total_contribs"
                    :amount="item.info.token_contribs"
                    @click="toSingleGitcoin(item.platform, item.identity, item.id, item.type)"
                ></GitcoinCard>
            </div>
            <div
                class="fixed bottom-2 left-0 right-0 flex gap-5 m-auto px-4 py-4 w-full max-w-md bg-btn-container"
                v-if="isOwner"
            >
                <Button
                    size="lg"
                    class="m-auto text-gitcoin-btn-m-text text-lg bg-gitcoin-btn-m shadow-gitcoin-btn-m"
                    @click="toSetupGitcoins"
                >
                    <span>Manage Donations</span>
                </Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import GitcoinTitle from '@/components/Donation/GitcoinTitle.vue';
import GitcoinCard from '@/components/Donation/GitcoinCard.vue';
import config from '@/config';
import RSS3 from '@/common/rss3';
import { GeneralAssetWithTags } from '@/common/types';
import { debounce } from 'lodash';
import utils from '@/common/utils';
import { RSS3Profile } from 'rss3-next/types/rss3';
import Header from '@/components/Common/Header.vue';

@Options({
    name: 'Gitcoins',
    components: { Button, GitcoinTitle, GitcoinCard, Header },
})
export default class Gitcoins extends Vue {
    rns: string = '';
    ethAddress: string = '';
    grants: number = 0;
    contribs: number = 0;
    gitcoins: GeneralAssetWithTags[] = [];
    isOwner: boolean = false;
    rss3Profile: RSS3Profile = {};
    scrollTop: number = 0;
    lastRoute: string = '';

    async mounted() {
        this.mountScrollEvent();
    }

    async initLoad() {
        this.lastRoute = this.$route.fullPath;
        this.contribs = 0;
        this.gitcoins = [];

        await RSS3.reconnect();
        const rss3 = await RSS3.visitor();
        const owner: string = <string>rss3.account.address;

        const { ethAddress, rns } = await utils.getAddress(<string>this.$route.params.address);
        this.ethAddress = ethAddress;
        this.rns = rns;
        this.isOwner = ethAddress == owner;

        this.rss3Profile = await rss3.profile.get(this.ethAddress);

        // Setup theme
        const themes = RSS3.getAvailableThemes(await rss3.assets.get(this.ethAddress));
        if (themes[0]) {
            document.body.classList.add(themes[0].class);
        } else {
            document.body.classList.remove(...document.body.classList);
        }

        const gitcoinsData = await RSS3.getAssetProfile(this.ethAddress, 'Gitcoin-Donation');
        if (gitcoinsData) {
            const { listed } = await utils.initAssets(
                await rss3.assets.get(this.ethAddress),
                gitcoinsData.assets,
                'Gitcoin-Donation',
            );
            this.gitcoins = listed;
            this.grants = this.gitcoins.length;
        }
    }

    toSetupGitcoins() {
        this.$router.push(`/setup/gitcoins`);
    }

    toGitcoin() {
        window.open(`https://gitcoin.co/`);
    }

    toSingleGitcoin(platform: string, identity: string, id: string, type: string) {
        this.$router.push(
            (config.subDomain.isSubDomainMode ? '' : `/${this.rns || this.ethAddress}`) +
                `/singlegitcoin/${platform}/${identity}/${id}/${type}`,
        );
    }

    mountScrollEvent() {
        const el = document.getElementById('main');
        if (el) {
            el.addEventListener(
                'scroll',
                debounce((ev) => {
                    this.scrollTop = el.scrollTop;
                }, 100),
            );
        }
    }

    activated() {
        if (this.lastRoute === this.$route.fullPath) {
            const el = document.getElementById('main');
            if (el) {
                el.scrollTop = this.scrollTop;
            }
        } else {
            this.initLoad();
        }
    }
}
</script>

<style></style>
