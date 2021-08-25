<template>
    <div class="h-screen bg-nft-bg overflow-y-auto">
        <div class="main px-4 py-8 max-w-md m-auto">
            <div class="header flex justify-between items-center pb-4">
                <Button size="sm" class="w-10 h-10 bg-white text-primary shadow-secondary" @click="back">
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
                <div class="section-title text-2xl text-nft-title font-bold text-center">NFTs</div>
                <ImgHolder
                    class="w-10 h-10 inline-flex my-auto"
                    :is-rounded="true"
                    :is-border="false"
                    src="https://i.imgur.com/GdWEt4z.jpg"
                    alt="nya"
                />
            </div>
            <div class="nft-list flex flex-wrap justify-between items-center gap-y-4">
                <div class="relative" v-for="(item, index) in nftList" :key="index">
                    <NFTItem
                        :size="NFTWidth > 200 ? 200 : NFTWidth"
                        :imageUrl="item.image_url"
                        @click="toSinglenftPage"
                    />
                    <NFTBadges
                        class="absolute z-50 top-2.5 right-2.5"
                        chain="Ethereum"
                        location="overlay"
                        collectionImg="https://i.imgur.com/GdWEt4z.jpg"
                    />
                </div>
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

@Options({
    components: { ImgHolder, Button, NFTItem, NFTBadges },
})
export default class NFTs extends Vue {
    public NFTWidth: number = (window.innerWidth - 52) / 2;
    public nftList: Array<Object> = [
        {
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
        },
        {
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
        },
        {
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
        },
    ];
    public toSinglenftPage() {
        this.$router.push(`/singlenft`);
    }
    public back() {
        window.history.back();
    }
}
</script>

<style></style>
