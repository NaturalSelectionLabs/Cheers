<template>
    <div class="details-container">
        <h2>{{ details.name }} #{{ details.token_id }}</h2>
        <ScanTag
            :chain="chain"
            class="cursor-pointer"
            @click="toExternalLink(details.asset_contract?.address, details.token_id)"
        />
        <div>
            <h3>Description</h3>
            <p>{{ details.description }}</p>
        </div>
        <div>
            <h3>Properties</h3>
            <div class="traits-container">
                <Trait
                    v-for="(item, index) in details.traits"
                    :key="index"
                    :traitType="item.trait_type"
                    :traitValue="item.value"
                ></Trait>
            </div>
        </div>
        <div>
            <h3>About {{ details.collection?.name }}</h3>
            <p>{{ details.collection?.description }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Trait from '@/components/NFT/Trait.vue';
import ScanTag from '@/components/NFT/ScanTag.vue';

@Options({
    components: { Trait, ScanTag },
    props: {
        details: Object,
        chain: String,
    },
})
export default class NFTDetail extends Vue {
    details!: Object;
    chain!: String;

    public toExternalLink(address: string, tokenId: string) {
        window.open(`https://opensea.io/assets/${address}/${tokenId}`);
    }
}
</script>

<style scoped lang="postcss">
@layer components {
    .details-container {
        @apply w-full px-5 py-4 bg-white rounded filter drop-shadow-nft text-black flex flex-col justify-start items-start gap-5;
    }
    h2 {
        @apply text-xl font-semibold capitalize overflow-ellipsis overflow-hidden break-all;
    }
    h3 {
        @apply text-lg font-medium capitalize;
    }
    p {
        @apply text-sm leading-normal break-all;
    }
    .traits-container {
        @apply flex flex-row flex-wrap justify-start items-center gap-2.5;
    }
}
</style>
