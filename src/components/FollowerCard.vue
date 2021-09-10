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
                {{ $props.address.startsWith('0x') ? $props.address : `${$props.address}.pass3.me` }}
            </p>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ColorThief from 'colorthief';
import { hslToRgb, rgbToHsl } from '@/common/utils';

@Options({
    props: {
        avatar: String,
        name: String,
        address: String,
    },
})
export default class FollowerCard extends Vue {
    name!: string;

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
        (<HTMLDivElement>this.$refs.card).style.backgroundColor = `rgb(${newRGB[0]}, ${newRGB[1]}, ${newRGB[2]})`;
        this.$emit('color', rgb);
    }
}
</script>

<style scoped lang="postcss">
@layer components {
    .follower-container {
        @apply px-8 md:px-10 py-4 flex flex-row items-center justify-start gap-6 md:gap-10 rounded bg-white shadow-primary-card;

        .avatar > img {
            @apply flex-shrink h-16 w-16 flex-grow-0 rounded-full object-cover;
        }

        .info {
            @apply flex-1 w-0;
        }

        .username {
            @apply font-bold text-2xl truncate;
        }

        .address {
            @apply font-medium text-lg truncate;
        }
    }
}
</style>
