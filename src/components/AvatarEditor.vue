<template>
    <label class="avatar" :class="size">
        <img class="image" :src="newUrl || url" v-show="newUrl || url" alt="Avatar Upload" />
        <span
            class="plus"
            :class="{
                fill: newUrl || url,
            }"
        >
            <i class="bx bx-plus" />
        </span>
        <input type="file" class="hidden" accept="image/*" @change="preview" />
    </label>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import ipfs from '@/common/ipfs';

@Options({
    props: {
        size: String,
        url: String,
    },
    components: {},
})
export default class Avatar extends Vue {
    file?: File;
    newUrl: string = '';

    preview(evt: any) {
        this.file = evt.target?.files?.[0];
        this.newUrl = URL.createObjectURL(this.file);
    }

    async upload() {
        if (this.file) {
            return ipfs.upload(this.file);
        } else {
            return null;
        }
    }
}
</script>

<style lang="postcss" scoped>
@layer components {
    .avatar {
        @apply flex justify-center items-center cursor-pointer rounded-full relative bg-gray-bg;

        &.sm {
            @apply w-14 h-14;
        }
        &.md {
            @apply w-16 h-16;
        }
        &.lg {
            @apply w-24 h-24;
        }

        .image {
            @apply object-contain object-center absolute left-0 top-0 w-full h-full rounded-full object-cover;
        }
    }
}
</style>
