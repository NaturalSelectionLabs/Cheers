<template>
    <div class="h-screen bg-gitcoin-bg overflow-y-auto">
        <div class="main px-4 py-8 max-w-md m-auto">
            <div class="header flex justify-between items-center pb-4">
                <Button size="sm" class="w-10 h-10 bg-white text-primary shadow-secondary" @click="back">
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
                <ImgHolder
                    class="w-10 h-10 inline-flex my-auto cursor-pointer"
                    :is-rounded="true"
                    :is-border="false"
                    src="https://i.imgur.com/GdWEt4z.jpg"
                    alt="nya"
                />
            </div>
            <GitcoinItem imageUrl="https://i.imgur.com/GdWEt4z.jpg" :size="Width > 416 ? 416 : Width"></GitcoinItem>
            <div
                class="
                    w-full
                    px-5
                    py-4
                    bg-white
                    shadow-gitcoin-sm
                    rounded
                    flex flex-col
                    justify-start
                    items-start
                    gap-4
                    text-black
                    mt-4
                "
            >
                <div class="w-full">
                    <h2 class="text-xl font-semibold truncate">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiisitaquequodpraesentium
                    </h2>
                    <p class="text-sm leading-normal text-gitcoin-title truncate">
                        https://Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Blanditiisitaquequodpraesentium
                    </p>
                </div>
                <div class="flex flex-wrap">
                    <span class="font-medium text-sm rounded-sm px-2 py-1 bg-top-bg text-top-title mr-2 mb-2">
                        <i class="bx bx-medal bx-xs mr-1" />Top 10 Funders
                    </span>
                    <span class="font-medium text-sm rounded-sm px-2 py-1 bg-earliest-bg text-earliest-title mr-2 mb-2">
                        <i class="bx bx-medal bx-xs mr-1" />Earliest 10 Funders
                    </span>
                </div>
                <div>
                    <h2 class="text-xl font-semibold">Contributions</h2>
                    <h1 class="text-2xl font-semibold text-gitcoin-title">2</h1>
                </div>
                <div class="w-full flex flex-col gap-y-2">
                    <div class="flex flex-row justify-start gap-x-2">
                        <div
                            class="
                                flex-1
                                bg-gitcoin-bg
                                text-black
                                rounded rounded-xl
                                flex flex-row
                                justify-between
                                items-center
                                px-4
                                py-2
                            "
                        >
                            <div class="text-gitcoin-title">0.0175 ETH</div>
                            <div>3 days, 12 hours ago</div>
                        </div>
                        <Button size="sm" class="w-9 h-9 ml-1 bg-gitcoin-button text-white shadow-gitcoin-sm">
                            <i class="bx bx-link-external bx-xs" />
                        </Button>
                    </div>
                    <div class="flex flex-row justify-start gap-x-2">
                        <div
                            class="
                                flex-1
                                bg-gitcoin-bg
                                text-black
                                rounded rounded-xl
                                flex flex-row
                                justify-between
                                items-center
                                px-4
                                py-2
                            "
                        >
                            <div class="text-gitcoin-title">0.0175 ETH</div>
                            <div>3 days, 2 hours ago</div>
                        </div>
                        <Button size="sm" class="w-9 h-9 ml-1 bg-gitcoin-button text-white shadow-gitcoin-sm">
                            <i class="bx bx-link-external bx-xs" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import ImgHolder from '@/components/ImgHolder.vue';
import GitcoinItem from '@/components/GitcoinItem.vue';

@Options({
    components: { ImgHolder, Button, GitcoinItem },
    prop: {},
})
export default class SingleGitcoin extends Vue {
    public Width: number = window.innerWidth - 32;

    public back() {
        window.history.back();
    }
}
</script>

<style></style>
