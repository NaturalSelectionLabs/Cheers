<template>
    <div
        class="
            w-full
            flex flex-row
            justify-start
            items-center
            rounded rounded-2xl
            bg-body-bg
            text-body-text
            border-card
            shadow-gitcoin
            cursor-pointer
        "
    >
        <div
            class="w-32 h-32 bg-cover bg-center bg-no-repeat rounded rounded-2xl m-0.5 flex-shrink"
            :style="{ backgroundImage: `url(${imageUrl})` }"
        ></div>
        <div class="w-45 flex-1 px-8">
            <p class="w-full mb-2 font-semibold text-lg truncate">{{ name }}</p>
            <div class="w-full flex flex-row gap-x-6 overflow-y-auto">
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
                <div v-for="(item, index) in amount" :key="index">
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
