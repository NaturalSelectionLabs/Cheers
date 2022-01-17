<template>
    <div class="flex flex-row gap-2 justify-start cursor-pointer">
        <FootprintItem :imageUrl="imageUrl" :size="type === 'details' ? 'xl' : 'lg'" class="flex-shrink-0" />
        <section
            class="flex flex-1 flex-col justify-center w-0 text-body-text text-sm leading-normal"
            :class="{ 'md:gap-2': type === 'details' }"
        >
            <span class="text-body-text truncate">{{ getDate() }}</span>
            <span class="text-body-text truncate"> <span class="text-primary-text">@ </span>{{ location }}</span>
            <div class="line-clamp-2">
                <span class="text-primary-text">{{ username }} attended</span>
                <span class="flex-1 w-0">{{ ' ' + activity }}</span>
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
