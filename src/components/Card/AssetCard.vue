<template>
    <div class="flex flex-row gap-2 items-center justify-start w-full">
        <NFTItem class="flex-shrink-0 mr-1 cursor-pointer" :image-url="imageUrl || defaultAvatar" size="sm" />
        <div class="flex flex-1 flex-col gap-0.5 w-0 text-sm">
            <span>{{ date }}</span>
            <span class="truncate">
                <span class="text-primary-text">{{ username }} participated in</span> {{ name }}
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import NFTItem from '@/components/NFT/NFTItem.vue';
import { formatDate } from '@/common/timeStamp';

@Options({
    props: {
        imageUrl: String,
        timestamp: String,
        username: String,
        name: String,
        type: String,
    },
    components: {
        NFTItem,
    },
})
export default class AssetCard extends Vue {
    timestamp!: string;
    date: string = '';

    mounted() {
        this.date = formatDate(this.timestamp);
    }
}
</script>
