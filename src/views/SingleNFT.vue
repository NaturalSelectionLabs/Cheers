<template>
    <div class="main h-auto px-4 py-8 bg-nft-bg">
        <div class="header flex justify-between items-center pb-4">
            <Button size="sm" class="w-10 h-10 bg-white text-nft-button shadow-nft">
                <i class="bx bx-chevron-left bx-sm"></i>
            </Button>
            <div class="section-title text-2xl text-nft-title font-bold text-center">{{ details.name + ' NFT' }}</div>
            <div class="badges flex flex-row justify-center items-center">
                <account-item size="24" :chain="BSC"></account-item>
                <account-item size="24" :chain="Ronin"></account-item>
            </div>
        </div>
        <div class="content">
            <div class="image pb-4">
                <ImgHolder
                    class="w-auto shadow-nft-sm inline-flex m-0.5"
                    :is-square="true"
                    :is-border="true"
                    src="https://i.imgur.com/GdWEt4z.jpg"
                    alt="nya"
                />
            </div>
            <NFTDetail :chain="Ronin" :details="details" />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import AccountItem from '@/components/AccountItem.vue';
import ImgHolder from '@/components/ImgHolder.vue';
import NFTDetail from '@/components/NFT/NFTDetails.vue';

@Options({
    components: { AccountItem, Button, NFTDetail, ImgHolder },
})
export default class SingleNFT extends Vue {
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
}
</script>

<style></style>
