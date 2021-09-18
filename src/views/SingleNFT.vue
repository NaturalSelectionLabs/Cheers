<template>
    <div class="h-screen bg-nft-bg overflow-y-auto">
        <div class="main px-4 pt-8 pb-20 max-w-md m-auto">
            <div class="header pb-4 relative">
                <div
                    class="
                        section-title
                        text-xl text-nft-title
                        font-bold
                        text-center
                        w-full
                        h-10
                        absolute
                        z-0
                        top-0
                        px-16
                        flex
                        justify-center
                        items-center
                    "
                >
                    {{ details.collection?.name }}
                </div>
                <div class="flex justify-between items-center">
                    <Button
                        size="sm"
                        class="w-10 h-10 bg-secondary-btn text-secondary-btn-text shadow-secondary-btn"
                        @click="back"
                    >
                        <i class="bx bx-chevron-left bx-sm"></i>
                    </Button>
                    <NFTBadges
                        class="absolute z-50 right-0"
                        :chain="details.chain"
                        location="header"
                        :collectionImg="details.collection?.image_url"
                    />
                </div>
            </div>
            <div class="content">
                <div class="image pb-4">
                    <NFTItem
                        :imageUrl="details.animation_url || details.image_url"
                        :poster-url="details.image_url"
                        :size="NFTWidth > 416 ? 416 : NFTWidth"
                        :is-showing-details="true"
                    />
                </div>
                <NFTDetail :chain="details.chain" :details="details" market="opensea" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import NFTItem from '@/components/NFT/NFTItem.vue';
import NFTDetail from '@/components/NFT/NFTDetails.vue';
import AccountItem from '@/components/AccountItem.vue';
import NFTBadges from '@/components/NFT/NFTBadges.vue';
import RSS3, { IRSS3 } from '@/common/rss3';
import RNSUtils from '@/common/rns';
import { NFT } from '@/common/types';
import config from '@/config';

@Options({
    name: 'SingleNFT',
    components: { Button, NFTDetail, NFTItem, AccountItem, NFTBadges },
})
export default class SingleNFT extends Vue {
    rns: string = '';
    ethAddress: string = '';
    public NFTWidth: number = window.innerWidth - 32;
    private details: NFT = {
        chain: '',
        token_id: '',
        asset_contract: {
            address: '',
        },
    };

    async mounted() {
        const address = <string>this.$route.params.address;
        if (!address.startsWith('0x')) {
            this.rns = address;
            this.ethAddress = (await RNSUtils.name2Addr(address + config.rns.suffix)).toString();
        } else {
            this.ethAddress = address;
            this.rns = await RNSUtils.addr2Name(address);
        }

        const platform: string = String(this.$route.params.platform);
        const identity: string = String(this.$route.params.identity);
        const id: string = String(this.$route.params.id);

        const rss3 = await RSS3.visitor();

        // Setup theme
        const themes = RSS3.getAvailableThemes(await rss3.assets.get(this.ethAddress));
        if (themes[0]) {
            document.body.classList.add(themes[0].class);
        } else {
            document.body.classList.remove(...document.body.classList);
        }

        const data = await RSS3.getAssetProfile(this.ethAddress);

        if (data) {
            const asset = data.assets.find(
                (ag) => ag.platform === platform && ag.identity === identity && ag.id === id,
            );
            if (asset) {
                const detail = (await RSS3.getNFTDetails(this.ethAddress, platform, identity, id))?.data;
                if (detail) {
                    this.details = detail;
                }
            }
        }
    }

    public back() {
        if (window.history.length > 2) {
            window.history.back();
        } else {
            this.$router.push(`/${this.rns || this.ethAddress}/nfts`);
        }
    }
}
</script>

<style></style>
