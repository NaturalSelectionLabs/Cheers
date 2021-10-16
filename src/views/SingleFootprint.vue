<template>
    <div class="h-screen bg-footprint-bg overflow-y-auto">
        <div class="px-4 pt-8 pb-20 max-w-screen-lg m-auto">
            <div class="header flex justify-between items-center pb-4">
                <Button
                    size="sm"
                    class="w-10 h-10 bg-secondary-btn text-secondary-btn-text shadow-secondary-btn"
                    @click="back"
                >
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
                <div class="text-xl text-footprint-title font-bold text-center">Footprints</div>
                <ImgHolder
                    class="w-10 h-10 inline-flex my-auto cursor-pointer"
                    :is-rounded="true"
                    :is-border="false"
                    src="https://i.imgur.com/GdWEt4z.jpg"
                />
            </div>
            <section class="max-w-screen-sm m-auto">
                <FootprintItem class="mb-4" imageUrl="https://i.imgur.com/GdWEt4z.jpg" :size="FootprintWidth" />
                <div class="w-full px-5 py-4 mt-4 filter text-body-text flex flex-col">
                    <div class="flex flex-row justify-between items-center">
                        <h2 class="text-xl font-semibold truncate">RSS3 Taurus ♉️️ Conference</h2>
                        <Button
                            size="sm"
                            class="w-9 h-9 ml-1 bg-footprint-btn-m text-footprint-btn-m-text shadow-footprint-btn-m"
                        >
                            <i class="bx bx-link-external bx-xs" />
                        </Button>
                    </div>
                    <section class="text-sm leading-normal text-footprint-title flex flex-col gap-2">
                        <div class="truncate cursor-pointer">
                            <i class="bx bx-link align-middle mr-2" />
                            <span>https://i.imgur.com/GdWEt4z.jpg</span>
                        </div>
                        <div class="flex flex-row gap-2 items-center">
                            <CalendarIcon />
                            <span class="text-body-text">May 03, 2021</span>
                        </div>
                        <div class="flex flex-row gap-2 items-center">
                            <LocationIcon />
                            <span class="text-body-text">NYC</span>
                        </div>
                    </section>
                    <h3 class="text-footprint-title text-lg font-medium capitalize mt-2">Description</h3>
                    <p class="text-sm leading-loose text-body-text">
                        RSS3 presents the Taurus ♉️️ Conference<br />
                        A quarterly team meetup curated by NSL
                    </p>
                </div>
            </section>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import ImgHolder from '@/components/ImgHolder.vue';
import FootprintItem from '@/components/FootprintItem.vue';
import CalendarIcon from '@/components/Icons/CalendarIcon.vue';
import LocationIcon from '@/components/Icons/LocationIcon.vue';

@Options({
    name: 'SingleFootprint',
    components: { ImgHolder, Button, FootprintItem, CalendarIcon, LocationIcon },
})
export default class SingleFootprint extends Vue {
    FootprintWidth: number = Math.min(window.innerWidth - 32, 640);

    back() {
        window.history.back();
    }
}
</script>

<style></style>
