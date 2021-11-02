<template>
    <div
        class="flex flex-row gap-2 justify-start p-4"
        :class="{
            'opacity-50': special,
        }"
    >
        <FootprintItem
            :imageUrl="imageUrl"
            :size="78"
            class="flex-shrink-0"
            :class="{
                'animate-bounce': special,
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
        special: Boolean,
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
}
</script>

<style></style>
