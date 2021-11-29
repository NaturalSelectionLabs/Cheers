<template>
    <div class="follower-container" ref="card">
        <div class="avatar">
            <img :src="$props.avatar" ref="avatar" crossorigin="anonymous" />
        </div>
        <div class="info">
            <p class="username">
                {{ $props.name }}
            </p>
            <p class="address">
                {{ $props.address.startsWith('0x') ? $props.address : $props.address + suffix }}
            </p>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ColorThief from 'colorthief';
import { hslToRgb, rgbToHsl } from '@/common/utils';
import config from '@/config';

@Options({
    props: {
        avatar: String,
        name: String,
        address: String,
    },
})
export default class FollowerCard extends Vue {
    name!: string;
    suffix: string = '.' + config.subDomain.rootDomain;

    mounted() {
        const colorThief = new ColorThief();
        const img = <HTMLImageElement>this.$refs.avatar;

        if (img.complete) {
            this.setBGColor(colorThief.getColor(img));
        } else {
            img.addEventListener('load', () => {
                this.setBGColor(colorThief.getColor(img));
            });
        }
    }

    setBGColor(rgb: [number, number, number]) {
        const hsl = rgbToHsl(...rgb);
        const newRGB = hslToRgb(hsl[0], hsl[1], 0.925);
        if (this.$refs.card) {
            (<HTMLDivElement>this.$refs.card).style.backgroundColor = `rgb(${newRGB[0]}, ${newRGB[1]}, ${newRGB[2]})`;
        }
        this.$emit('color', rgb);
    }
}
</script>

<style scoped lang="postcss">
@layer components {
    .follower-container {
        @apply flex flex-row gap-6 items-center justify-start px-8 py-4 bg-body-bg rounded shadow-follow-card md:gap-10 md:px-10;

        .avatar > img {
            @apply flex-grow-0 flex-shrink w-16 h-16 rounded-full object-cover;
        }

        .info {
            @apply flex-1 w-0;
        }

        .username {
            @apply text-2xl font-bold truncate;
        }

        .address {
            @apply text-lg font-medium truncate;
        }
    }
}
</style>
