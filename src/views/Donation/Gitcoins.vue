<template>
    <div id="main" class="h-screen bg-gitcoin-bg overflow-y-auto">
        <div class="m-auto pb-32 pt-8 px-4 max-w-screen-lg">
            <Header :ethAddress="ethAddress" :rns="rns" :rss3Profile="rss3Profile" title="Donations" theme="gitcoin" />
            <GitcoinTitle class="mb-6" :grants="grants" :contributions="contribs" />
            <div
                class="grid gap-6 grid-cols-1 sm:grid-cols-2"
                :class="{ 'pb-16': isOwner }"
                v-show="gitcoins.length !== 0"
            >
                <GitcoinCard
                    v-for="item in gitcoins"
                    :key="item.id"
                    :imageUrl="item.detail.grant.logo || defaultAvatar"
                    :name="item.detail.grant.title || 'Inactive Project'"
                    :contrib="item.detail.txs.length"
                    :amount="item.detail.txs"
                    @click="toSingleGitcoin(item.id)"
                />
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
import { utils as RSS3Utils } from 'rss3';
import { DetailedFootprint, GeneralAssetWithTags } from '@/common/types';
import { debounce } from 'lodash';
import utils from '@/common/utils';
import Header from '@/components/Common/Header.vue';
import setupTheme from '@/common/theme';

@Options({
    name: 'Gitcoins',
    components: { Button, GitcoinTitle, GitcoinCard, Header },
})
export default class Gitcoins extends Vue {
    rns: string = '';
    ethAddress: string = '';
    grants: number = 0;
    contribs: number = 0;
    gitcoins: DetailedFootprint[] = [];
    isOwner: boolean = false;
    rss3Profile: any = {};
    scrollTop: number = 0;
    lastRoute: string = '';

    async mounted() {
        this.mountScrollEvent();
    }

    async initLoad() {
        this.lastRoute = this.$route.fullPath;
        this.contribs = 0;
        this.gitcoins = [];

        const addrOrName = utils.getAddress(<string>this.$route.params.address);
        const pageOwner = await RSS3.setPageOwner(addrOrName);
        const loginUser = await RSS3.getLoginUser();
        this.ethAddress = pageOwner.address;
        this.rns = pageOwner.name;
        this.isOwner = await RSS3.isNowOwner();

        this.rss3Profile = await pageOwner.profile;

        // Setup theme
        setupTheme((await pageOwner.persona?.assets.auto.getList(pageOwner.address)) || []);

        const { donations } = await utils.initAssets();
        this.gitcoins = await utils.loadAssets(donations);
        this.grants = this.gitcoins.length;
    }

    toSetupGitcoins() {
        this.$router.push(`/setup/gitcoins`);
    }

    toGitcoin() {
        window.open(`https://gitcoin.co/`);
    }

    toSingleGitcoin(id: string) {
        const { platform, identity, type, uniqueID } = RSS3Utils.id.parseAsset(id);
        this.$router.push(
            (config.subDomain.isSubDomainMode ? '' : `/${this.rns || this.ethAddress}`) +
                `/singlegitcoin/${platform}/${identity}/${uniqueID}/${type}`,
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
            console.log('init load');
            this.initLoad();
        }
    }
}
</script>

<style></style>
