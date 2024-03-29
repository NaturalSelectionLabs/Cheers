<template>
    <div class="relative">
        <div
            class="flex items-center justify-center overflow-hidden rounded-full border border-item-border bg-item-bg filter"
            :style="{ width: size + 'px', height: size + 'px' }"
            @mouseenter="isHover = true"
            @mouseout="isHover = false"
            @touchstart="isHover = true"
            @touchend="isHover = false"
            ref="account"
        >
            <div
                class="h-full w-full bg-EVM bg-85 bg-center bg-no-repeat"
                :class="[address ? 'mix-blend-overlay' : 'opacity-50']"
            />
        </div>
        <Tooltip v-if="enableTooltip" v-show="isHover" :text="addressFilter($props.address)" view-option="account" />
        <Button
            v-show="deleteMode"
            size="sm"
            class="absolute right-0 top-0 z-20 h-6 w-6 bg-account-btn-m text-account-btn-m-text"
            @click="deleteAccount"
        >
            <i class="bx bx-minus bx-sm"></i>
        </Button>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import Tooltip from '@/components/Common/Tooltip.vue';
import { hex2rgb, hslToRgb, rgb2hex, rgbToHsl } from '@/common/color';

@Options({
    components: { Tooltip, Button },
    props: {
        size: Number,
        deleteMode: Boolean,
        address: String,
        enableTooltip: Boolean,
    },
})
export default class EVMpAccountItem extends Vue {
    size!: Number;
    address!: String;
    deleteMode!: Boolean;

    isHover: boolean = false;

    genGradient() {
        if (this.address) {
            const addr = this.address.replace(/^0x/, '');
            if (addr.length === 40) {
                let styleString = 'background: linear-gradient(';
                styleString += `-${(parseInt(addr.slice(0, 4), 16) % 360).toString()}deg`;
                for (let i = 0; i < 6; i++) {
                    styleString += `, ${rgb2hex(
                        ...hslToRgb(rgbToHsl(...hex2rgb(addr.slice(4 + i * 6, 4 + i * 6 + 6)))[0], 1, 0.86),
                    )} ${i * 20}%`;
                }
                styleString += ');';
                (<HTMLDivElement>this.$refs.account).setAttribute(
                    'style',
                    styleString + `width: ${this.size}px; height: ${this.size}px`,
                );
            }
        }
    }

    mounted() {
        this.genGradient();
    }
    updated() {
        this.genGradient();
    }

    deleteAccount() {
        this.$emit('deleteAccount');
    }

    addressFilter(address: string) {
        return address.length > 14 ? `${address.slice(0, 6)}....${address.slice(-4)}` : address;
    }
}
</script>

<style></style>
