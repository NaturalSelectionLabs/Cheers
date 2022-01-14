<template>
    <div class="flex flex-col gap-y-2.5 mt-4 py-4 w-full text-body-text">
        <div class="flex flex-row gap-2 items-start justify-between">
            <div class="flex-1 w-0">
                <h2 class="text-xl font-semibold truncate">{{ details.name }}</h2>
                <div
                    v-if="details.event_url"
                    class="flex flex-row items-center mt-1 text-primary-text cursor-pointer truncate"
                    @click="toExternalLink"
                >
                    <i class="bx bx-link align-middle mr-2" />
                    <span class="flex-1 w-0 truncate">{{ details.event_url }}</span>
                </div>
            </div>
        </div>
        <section class="flex flex-col gap-2 text-primary-text text-sm">
            <span class="text-body-text truncate">{{ getDate() }}</span>
            <span class="text-body-text truncate">
                <span class="text-primary-text">@ </span>{{ details.city || details.country || 'Metaverse' }}</span
            >
        </section>
        <section v-if="details.description">
            <h3 class="text-primary-text text-lg font-medium capitalize">Description</h3>
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
