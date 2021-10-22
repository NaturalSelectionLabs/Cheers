<template>
    <div class="h-screen bg-nft-bg overflow-y-auto">
        <div class="px-4 pt-8 pb-20 max-w-screen-lg m-auto">
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
            <section class="max-w-screen-sm m-auto">
                <div class="image pb-4">
                    <NFTItem
                        :imageUrl="details.animation_url || details.image_url"
                        :poster-url="details.image_url"
                        :size="NFTWidth"
                        :is-showing-details="true"
                    />
                </div>
                <NFTDetail :chain="details.chain" :details="details" market="opensea" />
            </section>
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
    NFTWidth: number = Math.min(window.innerWidth - 32, 640);
    private details: NFT = {
        chain: '',
        token_id: '',
        asset_contract: {
            address: '',
        },
    };

    async mounted() {
        await RSS3.reconnect();
        const rss3 = await RSS3.visitor();
        await this.getAddress();

        const platform: string = String(this.$route.params.platform);
        const identity: string = String(this.$route.params.identity);
        const id: string = String(this.$route.params.id);
        const type: string = String(this.$route.params.type);

        // Setup theme
        const themes = RSS3.getAvailableThemes(await rss3.assets.get(this.ethAddress));
        if (themes[0]) {
            document.body.classList.add(themes[0].class);
        } else {
            document.body.classList.remove(...document.body.classList);
        }

        const nftData = await RSS3.getAssetProfile(this.ethAddress, 'NFT');

        if (nftData) {
            const asset = nftData.assets.find(
                (ag) => ag.platform === platform && ag.identity === identity && ag.id === id && ag.type === type,
            );
            if (asset) {
                const detail = (await RSS3.getNFTDetails(this.ethAddress, platform, identity, id, type))?.data;
                if (detail) {
                    this.details = detail;
                }
            }
        }
    }

    async getAddress() {
        let address: string = '';
        if (config.subDomain.isSubDomainMode) {
            // Is subdomain mode
            address = window.location.host.split('.')[0];
        } else if (this.$route.params.address) {
            address = <string>this.$route.params.address;
        } else {
            return false;
        }

        if (address) {
            if (address.startsWith('0x')) {
                // Might be address type
                // Get RNS and redirect
                this.ethAddress = address;
                this.rns = await RNSUtils.addr2Name(address);
                if (this.rns !== '') {
                    if (config.subDomain.isSubDomainMode) {
                        window.location.host = this.rns + '.' + config.subDomain.rootDomain;
                    } else {
                        await this.$router.push(`/${this.rns}`);
                    }
                }
            } else {
                // RNS
                this.rns = address;
                this.ethAddress = (await RNSUtils.name2Addr(address + config.rns.suffix)).toString();
                if (parseInt(this.ethAddress) === 0) {
                    return false;
                }
            }
        }

        return true;
    }

    public back() {
        if (window.history.state.back) {
            window.history.back();
        } else {
            this.$router.push((config.subDomain.isSubDomainMode ? '' : `/${this.rns || this.ethAddress}`) + `/nfts`);
        }
    }
}
</script>

<style></style>
