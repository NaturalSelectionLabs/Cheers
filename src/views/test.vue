<template>
    <div class="flex flex-col justify-center m-auto h-screen overflow-y-auto">
        <div
            class="
                flex flex-col
                gap-y-4
                items-center
                m-auto
                py-36
                w-full
                bg-gradient-to-r
                from-blue-400
                object-cover object-center
            "
        >
            <TransBarCard class="w-96" title="Virtrine">
                <template #content>
                    <NFTItem
                        class="mr-1 cursor-pointer"
                        image-url="https://i.imgur.com/GdWEt4z.jpg"
                        poster-url="https://i.imgur.com/GdWEt4z.jpg"
                        size="sm"
                        v-for="id in 32"
                        :key="id"
                    />
                </template>
                <template #button>
                    <Button size="sm" class="w-8 h-8 text-primary-text bg-nft-btn-s">
                        <i class="bx bx-expand-alt bx-xs" />
                    </Button>
                </template>
            </TransBarCard>
            <TransBarCard class="w-96" title="Games">
                <template #content>
                    <NFTItem
                        class="mr-1 cursor-pointer"
                        image-url="https://i.imgur.com/GdWEt4z.jpg"
                        poster-url="https://i.imgur.com/GdWEt4z.jpg"
                        size="sm"
                        v-for="id in 32"
                        :key="id"
                    />
                </template>
                <template #button>
                    <Button size="sm" class="w-8 h-8 text-primary-text bg-nft-btn-s">
                        <i class="bx bx-expand-alt bx-xs" />
                    </Button>
                </template>
            </TransBarCard>
            <TransBarCard
                class="w-96"
                title="Organizations
 "
            >
                <template #content>
                    <NFTItem
                        class="mr-1 cursor-pointer"
                        image-url="https://i.imgur.com/GdWEt4z.jpg"
                        poster-url="https://i.imgur.com/GdWEt4z.jpg"
                        size="sm"
                        v-for="id in 32"
                        :key="id"
                    />
                </template>
                <template #button>
                    <Button size="sm" class="w-8 h-8 text-primary-text bg-nft-btn-s">
                        <i class="bx bx-expand-alt bx-xs" />
                    </Button>
                </template>
            </TransBarCard>
            <TransCard
                title="Footprints"
                class="w-96 border-footprint-border"
                :is-having-content="true"
                :is-single-line="false"
                id="footprint-card"
            >
                <template #header-button>
                    <section class="flex flex-row gap-2">
                        <Button size="sm" class="w-8 h-8 text-primary-text bg-footprint-btn-s">
                            <i class="bx bx-expand-alt bx-xs" />
                        </Button>
                    </section>
                </template>
                <template #content>
                    <div class="flex flex-col gap-1 px-0.5">
                        <FootprintCard
                            imageUrl="https://i.imgur.com/GdWEt4z.jpg"
                            username="Fendi"
                            start-date="0x61800f00"
                            end-date="0x61800f00"
                            activity="poapActivity"
                            location="Metaverse"
                            :special="false"
                        />
                        <div class="inline-flex pb-2 px-4 overflow-x-auto" style="scrollbar-width: thin">
                            <FootprintItem
                                v-for="item of 32"
                                :key="item"
                                imageUrl="https://i.imgur.com/GdWEt4z.jpg"
                                size="sm"
                                class="flex-shrink-0 mr-1"
                            />
                        </div>
                    </div>
                </template>
            </TransCard>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import Button from '@/components/Button/Button.vue';
import TransBarCard from '@/components/Card/TransBarCard.vue';
import TransCard from '@/components/Card/TransCard.vue';
import NFTItem from '@/components/NFT/NFTItem.vue';
import FootprintItem from '@/components/Footprint/FootprintItem.vue';
import FootprintCard from '@/components/Footprint/FootprintCard.vue';

@Options({
    name: 'Test',
    components: {
        Button,
        TransBarCard,
        NFTItem,
        TransCard,
        FootprintItem,
        FootprintCard,
    },
})
export default class Test extends Vue {}
</script>

<style lang="postcss" scoped></style>
