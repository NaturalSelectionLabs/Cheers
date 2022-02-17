<template>
    <label
        class="relative flex cursor-pointer items-center justify-center rounded-full bg-white bg-opacity-50"
        :class="{
            'h-14 w-14': size === 'sm',
            'h-16 w-16': size === 'md',
            'h-24 w-24': size === 'lg',
        }"
    >
        <ImgHolder
            class="absolute left-0 top-0 h-full w-full rounded-full object-cover object-center"
            :src="newUrl || url"
            v-show="newUrl || url"
            :isRounded="true"
            alt="Avatar Upload"
        />
        <div
            class="z-0 flex h-full w-full items-center justify-center rounded-full"
            :class="{
                'bg-white bg-opacity-40': newUrl || url,
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

<style></style>
