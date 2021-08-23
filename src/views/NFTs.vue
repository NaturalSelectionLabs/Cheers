<template>
    <div class="main h-screen px-4 py-8 bg-nft-bg">
        <div class="header flex justify-between items-center pb-4">
            <Button size="sm" class="w-10 h-10 bg-white text-nft-button shadow-nft">
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
        <div class="nft-list flex flex-wrap justify-between items-center gap-y-4 md:justify-start md:gap-4">
            <NFTItem
                :size="(windowWidth - 52) / 2"
                :imageUrl="item.image_url"
                v-for="(item, index) in nftList"
                :key="index"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import ImgHolder from '@/components/ImgHolder.vue';
import NFTItem from '@/components/NFT/NFTItem.vue';

@Options({
    components: { ImgHolder, Button, NFTItem },
})
export default class NFTs extends Vue {
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
}
</script>

<style></style>
