<template>
    <div class="flex flex-row gap-2 items-center justify-start w-full cursor-pointer">
        <NFTItem class="flex-shrink-0 mr-1 cursor-pointer" :image-url="imageUrl || defaultAvatar" :size="size" />
        <div class="flex flex-1 flex-col gap-0.5 w-0 text-sm">
            <span class="line-clamp-2">{{ username + getTitle(type) + name }}</span>
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
        username: String,
        name: String,
        size: String,
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
        if (this.timestamp) {
            let time = new Date(this.timestamp).getTime() / 1000;
            this.date = formatDate(time.toString());
        } else {
            this.date = 'After the birth of the universe';
        }
    }

    getTitle(type: string) {
        const title = new Map([
            ['Games', ' got one '],
            ['Awards', ' obtained '],
            ['Organizations', ' participated in '],
        ]);
        return type ? title.get(type) : ' attended ';
    }
}
</script>
