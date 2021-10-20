<template>
    <div class="relative">
        <div
            class="account-item"
            :style="{ width: size + 'px', height: size + 'px' }"
            @mouseenter="isHover = true"
            @mouseout="isHover = false"
            @touchstart="isHover = true"
            @touchend="isHover = false"
            ref="account"
        />
        <Tooltip v-if="enableTooltip" v-show="isHover" :text="addressFilter($props.address)" view-option="account" />
        <Button
            v-show="deleteMode"
            size="sm"
            class="w-6 h-6 bg-account-btn-m text-account-btn-m-text shadow-account absolute top-0 right-0 z-20"
            @click="deleteAccount"
        >
            <i class="bx bx-minus bx-sm"></i>
        </Button>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Button from '@/components/Button.vue';
import Tooltip from '@/components/Tooltip.vue';
import { hashicon } from '@emeraldpay/hashicon';
import { hex2rgb, hslToRgb, rgb2hex, rgbToHsl } from '@/common/utils';

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

    genIcon() {
        if (this.address) {
            const icon = hashicon(this.address.toString(), <number>this.size - 12);
            if ((<HTMLDivElement>this.$refs.account).hasChildNodes()) {
                (<HTMLDivElement>this.$refs.account).replaceChild(
                    icon,
                    (<HTMLDivElement>this.$refs.account).childNodes[0],
                );
            } else {
                (<HTMLDivElement>this.$refs.account).appendChild(icon);
            }
        }
    }

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
                    styleString + `width: ${this.size}px; height: ${this.size}px;`,
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

<style scoped lang="postcss">
@layer components {
    .account-item {
        @apply rounded-full border border-item-border filter shadow-account bg-item-bg bg-85 bg-center bg-no-repeat overflow-hidden flex justify-center items-center;
    }
}
</style>
