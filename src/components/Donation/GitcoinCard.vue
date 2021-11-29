<template>
    <div
        class="
            flex flex-row
            items-center
            justify-start
            w-full
            text-body-text
            bg-body-bg
            border-card
            rounded rounded-2xl
            shadow-gitcoin
            cursor-pointer
        "
    >
        <div
            class="flex-shrink m-0.5 w-32 h-32 bg-cover bg-center bg-no-repeat rounded rounded-2xl"
            :style="{ backgroundImage: `url(${imageUrl})` }"
        ></div>
        <div class="flex-1 px-8 w-45">
            <p class="mb-2 w-full text-lg font-semibold truncate">{{ name }}</p>
            <div class="flex flex-row gap-x-6 w-full overflow-y-auto">
                <div>
                    <div class="font-medium">
                        <vue3-autocounter
                            ref="counter"
                            :startAmount="0"
                            :endAmount="parseInt(contrib)"
                            :duration="1"
                            separator=","
                            :autoinit="true"
                        />
                    </div>
                    <div>Contrib</div>
                </div>
                <div v-for="(item, index) in amount" :key="index.toString()">
                    <div class="font-medium">
                        <vue3-autocounter
                            ref="counter"
                            :startAmount="0"
                            :endAmount="parseFloat(item.amount)"
                            :duration="1"
                            separator=","
                            :decimals="item.amount.split('.')[1].length"
                            :autoinit="true"
                        />
                    </div>
                    <div>{{ item.token }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Vue3Autocounter from 'vue3-autocounter';

@Options({
    components: { Vue3Autocounter },
    props: {
        imageUrl: String,
        name: String,
        contrib: String,
        amount: Array,
    },
})
export default class GitcoinCard extends Vue {}
</script>

<style></style>
