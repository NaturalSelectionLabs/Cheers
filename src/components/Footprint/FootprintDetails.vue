<template>
    <div class="flex flex-col gap-y-2.5 mt-4 px-5 py-4 w-full text-body-text">
        <div class="flex flex-row gap-2 items-start justify-between">
            <div class="flex-1 w-0">
                <h2 class="text-xl font-semibold truncate">{{ details.name }}</h2>
                <div v-if="details.event_url" class="flex flex-row items-center mt-1 text-footprint-title truncate">
                    <i class="bx bx-link align-middle mr-2" />
                    <span class="flex-1 w-0 truncate">{{ details.event_url }}</span>
                </div>
            </div>
            <Button
                v-if="details.event_url"
                size="sm"
                class="ml-1 w-9 h-9 text-footprint-btn-m-text bg-footprint-btn-m shadow-footprint-btn-m"
                @click="toExternalLink"
            >
                <i class="bx bx-link-external bx-xs" />
            </Button>
        </div>
        <section class="flex flex-col gap-2 text-footprint-title text-sm">
            <div class="flex flex-row gap-2 items-center">
                <CalendarIcon />
                <span class="text-body-text">{{ getDate() }}</span>
            </div>
            <div class="flex flex-row gap-2 items-center">
                <LocationIcon />
                <span class="text-body-text">{{ details.city || details.country || 'Metaverse' }}</span>
            </div>
        </section>
        <section v-if="details.description">
            <h3 class="text-footprint-title text-lg font-medium capitalize">Description</h3>
            <p class="text-body-text font-medium leading-loose">
                {{ details.description }}
            </p>
        </section>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import CalendarIcon from '@/components/Icons/CalendarIcon.vue';
import LocationIcon from '@/components/Icons/LocationIcon.vue';
import { POAP } from '@/common/types';

@Options({
    name: 'SingleFootprint',
    components: { Button, CalendarIcon, LocationIcon },
    props: {
        details: Object,
    },
})
export default class SingleFootprint extends Vue {
    details!: POAP;

    toExternalLink() {
        window.open(this.details.event_url);
    }

    getDate(): string {
        return this.details.start_date
            ? this.details.start_date +
                  (this.details.end_date && this.details.end_date !== this.details.start_date
                      ? ` ~ ${this.details.end_date}`
                      : '')
            : 'Loading...';
    }
}
</script>
