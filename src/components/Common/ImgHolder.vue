<template>
    <div
        :class="{
            'rounded-full': isRounded,
            rounded: isSquare,
        }"
    >
        <img
            class="h-full w-full object-cover"
            :class="{
                'rounded-full': isRounded,
                rounded: isSquare,
            }"
            :src="fixedSrc"
            :alt="alt"
        />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import utils from '@/common/utils';

@Options({
    props: {
        src: String,
        alt: String,
        isRounded: Boolean,
        isSquare: Boolean,
    },
})
export default class ImgHolder extends Vue {
    src!: String;
    get fixedSrc() {
        return utils.fixURLSchemas(this.src.toString());
    }
}
</script>

<style scoped lang="postcss"></style>
