<template>
    <div class="relative w-full p-2">
        <div class="box-border rounded-2xl aspect-w-16 aspect-h-9" ref="card">
            <div class="absolute inset-0 w-full h-full p-8 flex flex-col justify-center">
                <FollowerCard
                    class="shadow-blank"
                    :avatar="$props.avatar"
                    :name="$props.name"
                    :address="$props.address"
                    @color="getColor"
                />
                <div class="absolute bottom-4 md:bottom-5 right-8"><Passport /></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import FollowerCard from '@/components/FollowerCard.vue';
import Passport from '@/components/Icons/Passport.vue';
import { hslToRgb, rgbToHsl } from '@/common/utils';

@Options({
    components: { FollowerCard, Passport },
    props: {
        avatar: String,
        name: String,
        address: String,
    },
})
export default class ShareCard extends Vue {
    public themeColor?: string;
    public deepColor?: string;
    public lightColor?: string;

    public getColor(value: [number, number, number]) {
        this.deepColor = `rgb(${value[0]}, ${value[1]}, ${value[2]})`;
        const hsl = rgbToHsl(...value);
        const themeRGB = hslToRgb(hsl[0], hsl[1], 0.925);
        this.themeColor = `rgb(${themeRGB[0]}, ${themeRGB[1]}, ${themeRGB[2]})`;
        const lightRGB = hslToRgb(hsl[0], hsl[1], 0.95);
        this.lightColor = `rgb(${lightRGB[0]}, ${lightRGB[1]}, ${lightRGB[2]})`;

        // console.log(this.themeColor);
        // console.log(this.deepColor);
        // console.log(this.lightColor);

        (<HTMLDivElement>this.$refs.card).style.background = this.createBackgroundString();
    }

    public createBackgroundString() {
        return (
            'linear-gradient(107.57deg, ' +
            this.deepColor +
            ' 18.23%, ' +
            this.lightColor +
            ' 99.85%, ' +
            this.themeColor +
            ' 99.9%)'
        );
    }
}
</script>

<style></style>
