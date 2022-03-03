<template>
    <div class="flex cursor-pointer flex-row justify-start gap-2">
        <FootprintItem :imageUrl="imageUrl" :size="type === 'details' ? 'xl' : 'lg'" class="shrink-0" />
        <section
            class="flex w-0 flex-1 flex-col justify-center text-sm leading-normal text-body-text"
            :class="{ 'md:gap-1': type === 'details' }"
        >
            <span class="truncate text-body-text">{{ getDate() }}</span>
            <span class="truncate text-body-text">@ {{ location }}</span>
            <div class="line-clamp-2">
                {{ username }} attended <span class="w-0 flex-1">{{ activity }}</span>
            </div>
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
        type: String,
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
}
</script>

<style></style>
