<template>
    <div class="flex flex-row gap-2 justify-start p-4">
        <FootprintItem
            :imageUrl="imageUrl"
            :size="78"
            class="flex-shrink-0"
            :class="{
                'opacity-50 animate-bounce': special,
            }"
        />
        <section class="flex flex-1 flex-col justify-around text-body-text text-sm leading-normal">
            <div class="flex flex-row gap-2 items-center">
                <CalendarIcon />
                <span class="flex-1 w-0 text-body-text truncate">{{ getDate() }}</span>
            </div>
            <div class="flex flex-row gap-2 items-center">
                <LocationIcon />
                <span class="flex-1 w-0 text-body-text truncate">{{ location }}</span>
            </div>
            <div class="flex flex-row gap-2 font-medium">
                <div class="text-footprint-title">{{ username }} attended</div>
                <div class="flex-1 w-0 truncate">{{ activity }}</div>
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
import FootprintItem from '@/components/FootprintItem.vue';
import CalendarIcon from '@/components/Icons/CalendarIcon.vue';
import LocationIcon from '@/components/Icons/LocationIcon.vue';
import Button from '@/components/Button.vue';

@Options({
    props: {
        imageUrl: String,
        startDate: String,
        endDate: String,
        location: String,
        username: String,
        activity: String,
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
            ? this.formatDate(<string>this.startDate) +
                  (this.endDate && this.endDate !== <string>this.startDate
                      ? ` ~ ${this.formatDate(<string>this.endDate)}`
                      : '')
            : 'Loading...';
    }
    formatDate(ts: string): string {
        return new Date(parseInt(ts) * 1000).toLocaleDateString('en-US');
    }
    triggerClaim() {
        this.isClaiming = true;
        this.$emit('claim');
    }
}
</script>

<style></style>
