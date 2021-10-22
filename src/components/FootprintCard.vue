<template>
    <div class="flex flex-row justify-start gap-2 p-4">
        <FootprintItem :imageUrl="imageUrl" :size="78" class="flex-shrink-0" />
        <section class="flex-1 flex flex-col justify-around text-sm leading-normal text-body-text">
            <div class="flex flex-row gap-2 items-center">
                <CalendarIcon />
                <span class="flex-1 w-0 text-body-text truncate">{{ getDate() }}</span>
            </div>
            <div class="flex flex-row gap-2 items-center">
                <LocationIcon />
                <span class="flex-1 w-0 text-body-text truncate">{{ location }}</span>
            </div>
            <div class="font-medium flex flex-row gap-2">
                <div class="text-footprint-title">{{ username }} attended</div>
                <div class="flex-1 w-0 truncate">{{ activity }}</div>
            </div>
        </section>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import FootprintItem from '@/components/FootprintItem.vue';
import CalendarIcon from '@/components/Icons/CalendarIcon.vue';
import LocationIcon from '@/components/Icons/LocationIcon.vue';

@Options({
    props: {
        imageUrl: String,
        startDate: String,
        endDate: String,
        location: String,
        username: String,
        activity: String,
    },
    components: { FootprintItem, CalendarIcon, LocationIcon },
})
export default class FootprintCard extends Vue {
    imageUrl!: String;
    startDate!: String;
    endDate!: String;
    location!: String;
    username!: String;
    activity!: String;

    getDate(): string {
        return (
            this.formatDate(<string>this.startDate) +
            (this.endDate && this.endDate !== this.startDate ? ` ~ ${this.formatDate(<string>this.endDate)}` : '')
        );
    }
    formatDate(ts: string): string {
        return new Date(parseInt(ts) * 1000).toLocaleDateString('en-US');
    }
}
</script>

<style></style>
