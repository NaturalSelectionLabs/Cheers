<template>
    <div id="main" class="h-screen bg-gradient-to-tr from-blue-400 to-blue-200 via-blue-100 overflow-y-auto">
        <div class="m-auto pb-32 pt-8 px-4 max-w-screen-lg">
            <Header :ethAddress="ethAddress" :rns="rns" :rss3Profile="rss3Profile" />
            <TransBarCard
                :title="rss3Profile.name ? rss3Profile.name + `'s Donations` : 'Donations'"
                :haveDetails="true"
                :haveContent="false"
                :haveContentInfo="false"
            >
                <template #header>
                    <i v-if="isOwner" class="bx bxs-pencil bx-xs cursor-pointer" @click="toSetupGitcoins" />
                </template>
                <template #details>
                    <div class="grid gap-6 grid-cols-1 sm:grid-cols-2" v-show="gitcoins.length !== 0">
                        <GitcoinCard
                            v-for="item in gitcoins"
                            :key="item.id"
                            :imageUrl="item.detail.grant.logo || undefinedImageAlt"
                            :timestamp="item.detail.txs.slice(-1)[0].timeStamp"
                            :username="rss3Profile.name"
                            :title="item.detail.grant.title || 'Inactive Project'"
                            :amount="item.detail.txs.slice(-1)[0]"
                            @click="toSingleGitcoin(item.id)"
                        />
                    </div>
                </template>
            </TransBarCard>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import GitcoinCard from '@/components/Donation/GitcoinCard.vue';
import legacyConfig from '@/config';
import config from '@/common/config';
import RSS3 from '@/common/rss3';
import { DetailedDonation } from '@/common/types';
import { debounce } from 'lodash';
import utils from '@/common/utils';
import Header from '@/components/Common/Header.vue';
import { utils as RSS3Utils } from 'rss3';
import TransBarCard from '@/components/Card/TransBarCard.vue';
import { formatter } from '@/common/address';

@Options({
    name: 'Gitcoins',
    components: { Button, GitcoinCard, Header, TransBarCard },
})
export default class Gitcoins extends Vue {
    rns: string = '';
    ethAddress: string = '';
    grants: number = 0;
    contribs: number = 0;
    gitcoins: DetailedDonation[] = [];
    isOwner: boolean = false;
    rss3Profile: any = {};
    scrollTop: number = 0;
    lastRoute: string = '';
    $gtag: any;

    undefinedImageAlt = config.undefinedImageAlt;

    async mounted() {
        this.mountScrollEvent();
    }

    async initLoad() {
        this.lastRoute = this.$route.fullPath;
        this.contribs = 0;
        this.gitcoins = [];

        const addrOrName = utils.getAddress(<string>this.$route.params.address);
        const pageOwner = await RSS3.setPageOwner(addrOrName);
        this.ethAddress = pageOwner.address;
        this.rns = pageOwner.name;
        this.isOwner = RSS3.isNowOwner();

        utils.subDomainModeRedirect(this.rns);

        this.rss3Profile = pageOwner.profile;

        if (!this.rss3Profile.name) {
            this.rss3Profile.name = formatter(this.ethAddress);
        }

        const { donations } = await utils.initAssets();
        this.gitcoins = await utils.loadAssets(donations);
        this.grants = this.gitcoins.length;
        for (const grant of this.gitcoins) {
            this.contribs += grant.detail.txs.length;
        }
    }

    toSetupGitcoins() {
        this.$router.push(`/setup/gitcoins`);
    }

    toGitcoin() {
        window.open(`https://gitcoin.co/`);
    }

    toSingleGitcoin(id: string) {
        const { platform, identity, type, uniqueID } = RSS3Utils.id.parseAsset(id);
        this.$gtag.event('visitSingleGitcoin', {
            userid: this.rns || this.ethAddress,
            platform,
            identity,
            uniqueID,
            type,
        });
        this.$router.push(
            (legacyConfig.subDomain.isSubDomainMode ? '' : `/${this.rns || this.ethAddress}`) +
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
