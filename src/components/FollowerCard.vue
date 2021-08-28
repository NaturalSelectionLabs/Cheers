<template>
    <div class="follower-container button-shadow-secondary">
        <div class="avatar">
            <img :src="$props.avatar" ref="avatar" crossorigin="anonymous" />
        </div>
        <div class="info">
            <span class="username">
                {{ $props.name }}
            </span>
            <span class="address"> {{ $props.address.slice(0, 6) }}...{{ $props.address.slice(-4) }} </span>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ColorThief from 'colorthief';

@Options({
    props: {
        avatar: String,
        name: String,
        address: String,
    },
})
export default class FollowerCard extends Vue {
    mounted() {
        const colorThief = new ColorThief();
        const img = <HTMLImageElement>this.$refs.avatar;

        if (img.complete) {
            console.log(colorThief.getColor(img));
        } else {
            img.addEventListener('load', () => {
                console.log(colorThief.getColor(img));
            });
        }
    }
}
</script>

<style scoped lang="postcss">
@layer components {
    .follower-container {
        @apply px-9 py-4 flex flex-row items-center justify-start gap-10 rounded bg-white;

        .avatar > img {
            @apply h-16 w-16 rounded-full object-cover;
        }

        .info {
            @apply w-max h-full flex flex-col justify-around items-start;
        }

        .username {
            @apply font-bold text-2xl;
        }

        .address {
            @apply font-medium text-lg;
        }
    }
}
</style>
