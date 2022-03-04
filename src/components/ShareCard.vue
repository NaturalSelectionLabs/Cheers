<template>
    <div class="fixed top-0 left-0 h-screen w-screen">
        <div class="absolute h-full w-full bg-black bg-opacity-10" @click="close" />
        <div
            class="absolute inset-0 m-auto flex h-120 w-67 flex-col justify-between rounded p-8 md:h-160 md:w-90"
            ref="card"
            id="share-card"
        >
            <div class="flex flex-row gap-4">
                <ImgHolder class="flex h-8 w-8" :is-rounded="true" :is-border="false" :src="avatar" />
                <div class="flex items-center text-lg font-normal md:text-xl">
                    {{ name || rns || formattedAddress }}'s NFT Score
                </div>
            </div>
            <div class="self-center font-alfa-slab-one text-6xl md:text-7xl">
                {{ score }}
            </div>
            <div class="flex flex-row justify-between">
                <div class="flex flex-row items-end font-alfa-slab-one text-xl md:text-2xl">
                    <div>Rank #</div>
                    <div>
                        {{ rank }}
                    </div>
                </div>
                <div class="h-8 w-8 md:h-12 md:w-12">
                    <img :src="QRURL" alt="QRCode" />
                </div>
            </div>
        </div>
        <div class="fixed bottom-10 flex w-full flex-row justify-center gap-4">
            <Button size="sm" class="h-8 w-8 bg-secondary-btn-card text-btn-icon md:h-12 md:w-12" @click="tweet">
                <i class="bx bx-share bx-flip-horizontal" />
            </Button>
            <Button size="sm" class="h-8 w-8 bg-secondary-btn-card text-btn-icon md:h-12 md:w-12" @click="setRandColor">
                <i class="bx bx-refresh bx-flip-horizontal" />
            </Button>
            <Button
                v-if="isDownloading"
                size="sm"
                class="h-8 w-8 cursor-wait bg-secondary-btn-card text-btn-icon md:h-12 md:w-12"
            >
                <i class="bx bx-sync bx-spin" />
            </Button>
            <Button
                v-else
                size="sm"
                class="h-8 w-8 bg-secondary-btn-card text-btn-icon md:h-12 md:w-12"
                @click="saveImg"
            >
                <i class="bx bx-download" />
            </Button>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { formatter } from '@/common/address';
import ImgHolder from '@/components/Common/ImgHolder.vue';
import QRCode from 'qrcode';
import Button from '@/components/Button/Button.vue';

const colors = [
    { bg: '#0E38B1', fg: '#FFFFFF' },
    { bg: '#EEC0DB', fg: '#1B2AEA' },
    { bg: '#EF3E4A', fg: '#A2CAD0' },
    { bg: '#FBFE56', fg: '#2C62BA' },
    { bg: '#20AD65', fg: '#F6CABF' },
    { bg: '#112378', fg: '#F9EDD2' },
    { bg: '#7DE0E6', fg: '#EA4391' },
    { bg: '#75FFC0', fg: '#7135C7' },
    { bg: '#000000', fg: '#EA3323' },
    { bg: '#864BFF', fg: '#75FBCE' },
    { bg: '#CDFF06', fg: '#0606F5' },
    { bg: '#00FDFF', fg: '#5626F5' },
    { bg: '#00458A', fg: '#FAFF56' },
    { bg: '#34FF6D', fg: '#000000' },
];

@Options({
    components: { Button, ImgHolder },
    props: {
        address: String,
        rns: String,
        avatar: String,
        name: String, // Username setting in profile
        score: String,
        rank: String,
    },
})
export default class ShareCard extends Vue {
    address!: string;
    QRURL: string = '';
    isDownloading: boolean = false;

    get formattedAddress() {
        return formatter(this.address);
    }

    setRandColor() {
        const card = document.getElementById('share-card');
        const color = colors[Math.floor(Math.random() * colors.length)];
        if (card) {
            card.style.color = color.fg;
            card.style.backgroundColor = color.bg;
        }

        this.setQR(color.fg);
    }

    mounted() {
        this.setRandColor();
    }

    async setQR(dotsColor: string) {
        this.QRURL = await QRCode.toDataURL(window.location.href, {
            type: 'image/png',
            margin: 0,
            errorCorrectionLevel: 'L',
            color: {
                light: '#0000',
                dark: dotsColor,
            },
        });
    }

    close() {
        this.$emit('close');
    }

    async saveImg() {
        if (!this.isDownloading) {
            this.isDownloading = true;
            const card = document.getElementById('share-card');
            if (card) {
                const html2canvas: any = (await import(/* webpackChunkName: "html2canvas" */ '@/common/html2canvas.js'))
                    .default;
                const canvas = await html2canvas(card, {
                    useCORS: true,
                    logging: false,
                    scale: 3,
                });
                const link = document.createElement('a');
                link.download = `rank.png`;
                link.href = canvas.toDataURL();
                link.click();
            }
            this.isDownloading = false;
        }
    }

    async tweet() {
        const URL = window.location;
        window.open(`https://twitter.com/intent/tweet?text=Check out my NFT score at ${URL}.`);
    }
}
</script>

<style></style>
