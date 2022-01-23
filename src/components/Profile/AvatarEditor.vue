<template>
    <label class="avatar" :class="size">
        <ImgHolder class="image" :src="newUrl || url" v-show="newUrl || url" :isRounded="true" alt="Avatar Upload" />
        <div
            class="plus"
            :class="{
                fill: newUrl || url,
            }"
        >
            <i class="bx bx-plus bx-sm fill-current" v-show="!newUrl" />
            <i class="bx bx-pencil bx-sm fill-current" v-show="newUrl" />
        </div>
        <input type="file" class="hidden" accept="image/*" @change="preview" />
    </label>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import ipfs from '@/common/ipfs';
import ImgHolder from '@/components/Common/ImgHolder.vue';

@Options({
    components: { ImgHolder },
    props: {
        size: String,
        url: String,
    },
})
export default class Avatar extends Vue {
    file?: File;
    newUrl: string = '';
    $gtag: any;

    preview(evt: any) {
        this.file = evt.target?.files?.[0];
        if (this.file) {
            this.newUrl = URL.createObjectURL(this.file);
        }
    }

    async upload() {
        if (this.file) {
            this.$gtag.event('avatarUpload', {});
            return ipfs.upload(this.file);
        } else {
            return null;
        }
    }
}
</script>

<style scoped lang="postcss">
@layer components {
    .avatar {
        @apply relative flex items-center justify-center bg-white bg-opacity-50 rounded-full cursor-pointer;

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
            @apply absolute left-0 top-0 w-full h-full rounded-full object-cover object-center;
        }

        .plus {
            @apply z-0 flex items-center justify-center w-full h-full rounded-full;

            &.fill {
                @apply bg-white bg-opacity-40;
            }
        }
    }
}
</style>
