<template>
    <div class="follower-container button-shadow-secondary">
        <div class="avatar">
            <img :src="$props.avatar" ref="img" />
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
import Vibrant from 'node-vibrant';

@Options({
    props: {
        avatar: String,
        name: String,
        address: String,
    },
})
export default class FollowerCard extends Vue {
    public avatar!: string;
    mounted() {
        let img = this.$refs.img;

        img.addEventListener('load', function () {
            var vibrant = new Vibrant(img);
            var swatches = vibrant.swatches();
            console.log(swatches);
        });
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
