<template>
    <div id="main" class="h-screen bg-nft-bg overflow-y-auto">
        <div class="m-auto pb-32 pt-8 px-4 max-w-screen-lg">
            <Header :ethAddress="ethAddress" :rns="rns" :rss3Profile="rss3Profile" title="NFTs" theme="nft" />
            <div class="grid gap-6 grid-cols-2 justify-items-center sm:grid-cols-3">
                <div class="relative w-full" v-for="item in nfts" :key="item.platform + item.identity + item.id">
                    <NFTItem
                        class="cursor-pointer"
                        size="auto"
                        :imageUrl="
                            item.detail.image_preview_url ||
                            item.detail.image_url ||
                            item.detail.animation_url ||
                            item.detail.animation_original_url
                        "
                        :poster-url="item.detail.image_preview_url"
                        @click="
                            toSingleNFTPage(
                                item.id.split('-')[0],
                                item.id.split('-')[1],
                                item.id.split('-')[3].replaceAll('.', '-'),
                                item.id.split('-')[2].replaceAll('.', '-'),
                            )
                        "
                    />
                    <NFTBadges
                        class="absolute right-2.5 top-2.5"
                        :chain="item.detail.chain"
                        location="overlay"
                        :collectionImg="item.detail.collection?.image_url"
                    />
                </div>
            </div>
            <div
                class="fixed z-50 bottom-2 left-0 right-0 flex gap-5 m-auto px-4 py-4 w-full max-w-md bg-btn-container"
                v-if="isOwner"
            >
                <Button
                    size="lg"
                    class="m-auto text-nft-btn-m-text text-lg bg-nft-btn-m shadow-nft-btn-m"
                    @click="toSetupNfts"
                >
                    <span>Manage NFTs</span>
                </Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import NFTItem from '@/components/NFT/NFTItem.vue';
import NFTBadges from '@/components/NFT/NFTBadges.vue';
import RSS3 from '@/common/rss3';
import config from '@/config';
import { debounce } from 'lodash';
import utils from '@/common/utils';
import { RSS3Profile } from 'rss3-next/types/rss3';
import Header from '@/components/Common/Header.vue';
import setupTheme from '@/common/theme';

@Options({
    name: 'NFTs',
    components: { Button, NFTItem, NFTBadges, Header },
})
export default class NFTs extends Vue {
    rns: string = '';
    ethAddress: string = '';
    isOwner: boolean = false;
    nfts: any[] = [];
    rss3Profile: RSS3Profile = {};
    $gtag: any;
    scrollTop: number = 0;
    lastRoute: string = '';

    async initLoad() {
        this.lastRoute = this.$route.fullPath;

        const addrOrName = utils.getAddress(<string>this.$route.params.address);
        const pageOwner = await RSS3.setPageOwner(addrOrName);
        const loginUser = await RSS3.getLoginUser();
        this.ethAddress = pageOwner.address;
        this.rns = pageOwner.name;
        this.isOwner = pageOwner.address === loginUser.address;

        this.rss3Profile = await pageOwner.profile;

        // Setup theme
        setupTheme((await pageOwner.persona?.items.auto.getList(pageOwner.address)) || []);

        const { nfts } = await utils.initAssets();
        this.nfts = await utils.loadAssets(nfts);
    }

    toSingleNFTPage(platform: string, identity: string, id: string, type: string) {
        this.$gtag.event('visitSingleNft', {
            userid: this.rns || this.ethAddress,
            platform: platform,
            nftidentity: identity,
            nftid: id,
            nfttype: type,
        });
        this.$router.push(
            (config.subDomain.isSubDomainMode ? '' : `/${this.rns || this.ethAddress}`) +
                `/singlenft/${platform}/${identity}/${id}/${type}`,
        );
    }

    toSetupNfts() {
        this.$router.push(`/setup/nfts`);
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
