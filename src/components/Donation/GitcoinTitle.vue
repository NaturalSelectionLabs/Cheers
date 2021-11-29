<template>
    <div class="flex flex-col gap-y-2 w-full text-gitcoin-title">
        <div class="text-2xl font-bold">Total</div>
        <div class="flex flex-row gap-x-12 justify-start w-full text-lg font-normal">
            <div>
                <div class="text-xl font-medium">
                    <vue3-autocounter
                        ref="counter"
                        :startAmount="0"
                        :endAmount="parseInt(grants)"
                        :duration="1"
                        separator=","
                        :autoinit="true"
                    />
                </div>
                <div>Grants</div>
            </div>
            <div>
                <div class="text-xl font-medium">
                    <vue3-autocounter
                        ref="counter"
                        :startAmount="0"
                        :endAmount="parseInt(contributions)"
                        :duration="1"
                        separator=","
                        :autoinit="true"
                    />
                </div>
                <div>Contributions</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Vue3Autocounter from 'vue3-autocounter';

@Options({
    components: { Vue3Autocounter },
    props: {
        grants: Number,
        contributions: Number,
    },
})
export default class GitcoinTitle extends Vue {}
</script>

<style></style>
