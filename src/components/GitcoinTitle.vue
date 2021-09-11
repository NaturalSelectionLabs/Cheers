<template>
    <div class="w-full flex flex-col gap-y-2 text-gitcoin-title">
        <div class="font-bold text-2xl">Totel</div>
        <div class="w-full flex flex-row justify-start gap-x-12 text-lg font-normal">
            <div>
                <div class="font-medium text-xl">
                    <vue3-autocounter
                        ref="counter"
                        :startAmount="0"
                        :endAmount="grants"
                        :duration="1"
                        separator=","
                        :autoinit="true"
                    />
                </div>
                <div>Grants</div>
            </div>
            <div>
                <div class="font-medium text-xl">
                    <vue3-autocounter
                        ref="counter"
                        :startAmount="0"
                        :endAmount="contributions"
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
