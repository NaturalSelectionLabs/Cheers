<template>
    <div class="h-screen bg-nft-bg overflow-y-auto">
        <div class="main px-4 py-8 max-w-md m-auto">
            <div class="header flex justify-between items-center pb-4 relative">
                <Button size="sm" class="w-10 h-10 bg-white text-primary shadow-secondary" @click="back">
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
                <div class="section-title text-2xl text-nft-title font-bold text-center">
                    {{ details.name + ' NFT' }}
                </div>
                <div class="w-10 h-10">
                    <NFTBadges
                        class="absolute z-50 right-0"
                        chain="Ethereum"
                        location="header"
                        collectionImg="https://i.imgur.com/GdWEt4z.jpg"
                    />
                </div>
            </div>
            <div class="content">
                <div class="image pb-4">
                    <NFTItem
                        imageUrl="https://i.imgur.com/GdWEt4z.jpg"
                        :size="NFTWidth > 416 ? 416 : NFTWidth"
                    ></NFTItem>
                </div>
                <NFTDetail :chain="Ronin" :details="details" />
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

@Options({
    components: { Button, NFTDetail, NFTItem, AccountItem, NFTBadges },
})
export default class SingleNFT extends Vue {
    public NFTWidth: number = window.innerWidth - 32;
    public details: Object = {
        chain: 'Ethereum',
        name: 'Fendi Cat',
        token_id: '114',
        description: 'Fendi has short legs',
        image_url: 'https://i.imgur.com/GdWEt4z.jpg',
        image_thumbnail_url: 'https://i.imgur.com/GdWEt4z.jpg',
        asset_contract: {},
        collection: {
            name: 'Fendi Cat NFT',
            description: 'Munchkin Fendi',
            image_url: 'https://i.imgur.com/GdWEt4z.jpg',
        },
        traits: [
            {
                trait_type: 'age',
                value: ' 27 months',
            },
            {
                trait_type: 'weight',
                value: '2.7 kg',
            },
            { trait_type: 'color', value: 'calico' },
            {
                trait_type: 'gender',
                value: 'female',
            },
        ],
    };
    public back() {
        window.history.back();
    }
}
</script>

<style></style>
