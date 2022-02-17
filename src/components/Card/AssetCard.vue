<template>
    <div class="flex w-full cursor-pointer flex-row items-center justify-start gap-2">
        <NFTItem class="mr-1 shrink-0 cursor-pointer" :image-url="imageUrl || defaultAvatar" :size="size" />
        <div class="flex w-0 flex-1 flex-col gap-0.5 text-sm">
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
