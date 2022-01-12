<template>
    <div class="flex flex-row gap-2 justify-start">
        <FootprintItem :imageUrl="imageUrl" :size="size" />
        <section class="flex flex-1 flex-col gap-2 justify-around w-0 text-body-text text-sm leading-normal">
            <span class="text-body-text truncate">{{ getDate() }}</span>
            <span class="text-body-text truncate"> <span class="text-primary-text">@ </span>{{ location }}</span>
            <div class="line-clamp-2 font-medium">
                <span class="text-primary-text">{{ username }} attended</span>
                <span class="flex-1 w-0">{{ ' ' + activity }}</span>
            </div>
        </section>
        <section v-if="special" class="flex">
            <Button
                size="lg"
                class="m-auto text-footprint-btn-m-text text-lg bg-footprint-btn-m shadow-footprint-btn-m"
                @click="triggerClaim"
            >
                <span v-if="isClaiming">
                    <i class="bx bx-sm bx-loader-circle bx-spin" />
                </span>
                <span v-else>Claim it now</span>
            </Button>
        </section>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import FootprintItem from '@/components/Footprint/FootprintItem.vue';
import CalendarIcon from '@/components/Icons/CalendarIcon.vue';
import LocationIcon from '@/components/Icons/LocationIcon.vue';
import Button from '@/components/Button/Button.vue';

@Options({
    props: {
        imageUrl: String,
        startDate: String,
        endDate: String,
        location: String,
        username: String,
        activity: String,
        size: String,
        special: Boolean,
    },
    components: { Button, FootprintItem, CalendarIcon, LocationIcon },
})
export default class FootprintCard extends Vue {
    imageUrl!: String;
    startDate!: String;
    endDate!: String;
    location!: String;
    username!: String;
    activity!: String;
    isClaiming: boolean = false;

    getDate(): string {
        return this.startDate
            ? this.startDate +
                  (this.endDate && this.endDate !== <string>this.startDate ? ` ~ ${<string>this.endDate}` : '')
            : 'Loading...';
    }
    triggerClaim() {
        this.isClaiming = true;
        this.$emit('claim');
    }
}
</script>

<style></style>
