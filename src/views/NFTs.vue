<template>
    <div id="main" class="h-screen bg-nft-bg overflow-y-auto">
        <div class="px-4 pt-8 pb-32 max-w-screen-lg m-auto">
            <div class="header flex justify-between items-center pb-4">
                <Button
                    size="sm"
                    class="w-10 h-10 bg-secondary-btn text-secondary-btn-text shadow-secondary-btn"
                    @click="back"
                >
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
                <div class="section-title text-2xl text-nft-title font-bold text-center">NFTs</div>
                <ImgHolder
                    class="w-10 h-10 inline-flex my-auto cursor-pointer"
                    :is-rounded="true"
                    :is-border="false"
                    :src="rss3Profile.avatar"
                    :alt="rss3Profile.username"
                    @click="toPublicPage(rns || ethAddress)"
                />
            </div>
            <div class="nft-list grid grid-cols-2 sm:grid-cols-3 gap-6 justify-items-center">
                <div class="relative" v-for="item in nfts" :key="item.platform + item.identity + item.id">
                    <NFTItem
                        class="cursor-pointer"
                        :size="NFTWidth"
                        :imageUrl="item.info.animation_url || item.info.image_preview_url"
                        :poster-url="item.info.image_preview_url"
                        @click="toSingleNFTPage(item.platform, item.identity, item.id)"
                    />
                    <NFTBadges
                        class="absolute top-2.5 right-2.5"
                        :chain="item.platform"
                        location="overlay"
                        :collectionImg="item.info.collection_icon"
                    />
                </div>
            </div>
            <div
                class="px-4 py-4 flex gap-5 fixed bottom-2 left-0 right-0 max-w-md m-auto w-full z-50 bg-btn-container"
                v-if="isOwner"
            >
                <Button
                    size="lg"
                    class="m-auto text-lg bg-nft-btn-m text-nft-btn-m-text shadow-nft-btn-m"
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
import Button from '@/components/Button.vue';
import ImgHolder from '@/components/ImgHolder.vue';
import NFTItem from '@/components/NFT/NFTItem.vue';
import NFTBadges from '@/components/NFT/NFTBadges.vue';
import RSS3, { IRSS3 } from '@/common/rss3';
import RNSUtils from '@/common/rns';
import config from '@/config';
import { RSS3Asset } from 'rss3-next/types/rss3';
import { GeneralAsset, GeneralAssetWithTags } from '@/common/types';
import { debounce } from 'lodash';

interface Profile {
    avatar: string;
    username: string;
    address: string;
    bio: string;
}

@Options({
    name: 'NFTs',
    components: { ImgHolder, Button, NFTItem, NFTBadges },
})
export default class NFTs extends Vue {
    rns: string = '';
    ethAddress: string = '';
    NFTWidth: number = 0;
    isOwner: boolean = false;
    nfts: GeneralAssetWithTags[] = [];
    rss3Profile: Profile = {
        avatar: config.defaultAvatar,
        username: '',
        address: '',
        bio: '',
    };
    $gtag: any;
    scrollTop: number = 0;
    lastRoute: string = '';

    async mounted() {
        this.setNFTItemSize();
        window.onresize = () => {
            return (() => {
                this.setNFTItemSize();
            })();
        };
        this.mountScrollEvent();
    }

    async initLoad() {
        this.lastRoute = this.$route.fullPath;
        this.nfts = [];
        this.rss3Profile.avatar = config.defaultAvatar;

        const address = <string>this.$route.params.address;
        if (!address.startsWith('0x')) {
            this.rns = address;
            this.ethAddress = (await RNSUtils.name2Addr(address + config.rns.suffix)).toString();
        } else {
            this.ethAddress = address;
            this.rns = (await RNSUtils.addr2Name(address)).replace(config.rns.suffix, '');
        }
        await RSS3.reconnect();
        const rss3 = await RSS3.visitor();
        const owner: string = <string>rss3.account.address;

        this.isOwner = owner === this.ethAddress;

        const profile = await rss3.profile.get(this.ethAddress);

        this.rss3Profile.avatar = profile.avatar?.[0] || config.defaultAvatar;
        this.rss3Profile.username = profile.name?.[0] || '';

        // Setup theme
        const themes = RSS3.getAvailableThemes(await rss3.assets.get(this.ethAddress));
        if (themes[0]) {
            document.body.classList.add(themes[0].class);
        } else {
            document.body.classList.remove(...document.body.classList);
        }

        const data = await RSS3.getAssetProfile(this.ethAddress);

        if (data) {
            await this.loadNFTs(await rss3.assets.get(this.ethAddress), <GeneralAsset[]>data.assets);
        }
    }

    private setNFTItemSize() {
        if (window.innerWidth <= 640) {
            this.NFTWidth = Math.min((window.innerWidth - 52) / 2, 250);
        } else {
            this.NFTWidth = Math.min((window.innerWidth - 78) / 3, 300);
        }
    }

    private getAssetOrder(nft: RSS3Asset) {
        let order = -1;
        nft.tags?.forEach((tag: string) => {
            if (tag.startsWith('pass:order:')) {
                order = parseInt(tag.substr(11));
            }
        });
        return order;
    }

    async loadNFTs(assetsInRSS3File: RSS3Asset[], assetsGrabbed: GeneralAsset[]) {
        const assetsMerge: GeneralAssetWithTags[] = await Promise.all(
            (assetsGrabbed || []).map(async (ag: GeneralAssetWithTags) => {
                const origType = ag.type;
                if (config.hideUnlistedAsstes) {
                    ag.type = 'Invalid'; // Using as a match mark
                }
                for (const airf of assetsInRSS3File) {
                    if (
                        airf.platform === ag.platform &&
                        airf.identity === ag.identity &&
                        airf.id === ag.id &&
                        airf.type === origType
                    ) {
                        // Matched
                        ag.type = origType; // Recover type
                        if (airf.tags) {
                            ag.tags = airf.tags;
                        }
                        break;
                    }
                }
                return ag;
            }),
        );

        const NFTList: GeneralAssetWithTags[] = [];

        for (const am of assetsMerge) {
            if (am.type === 'NFT') {
                NFTList.push(am);
            }
        }

        this.nfts = NFTList.filter((asset) => !asset.tags || asset.tags.indexOf('pass:hidden') === -1).sort(
            (a, b) => this.getAssetOrder(a) - this.getAssetOrder(b),
        );
    }

    toSingleNFTPage(platform: string, identity: string, id: string) {
        this.$gtag.event('visitSingleNft', {
            userid: this.rns || this.ethAddress,
            platform: platform,
            nftidentity: identity,
            nftid: id,
        });
        this.$router.push(`/${this.rns || this.ethAddress}/singlenft/${platform}/${identity}/${id}`);
    }

    toPublicPage(address: string) {
        this.$router.push(`/${address}`);
    }

    toSetupNfts() {
        this.$router.push(`/setup/nfts`);
    }

    back() {
        this.$router.push(`/${this.rns || this.ethAddress}`);
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
