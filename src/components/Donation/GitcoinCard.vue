<template>
    <div class="flex w-full cursor-pointer flex-row items-center justify-start rounded-2xl border-card text-body-text">
        <div
            class="m-0.5 h-22 w-22 shrink rounded-2xl bg-white bg-cover bg-center bg-no-repeat md:h-28 md:w-28"
            :style="{ backgroundImage: `url(${imageUrl})` }"
        />
        <div class="w-0 flex-1 pl-8 text-sm md:text-base">
            <p>{{ date }}</p>
            <div class="line-clamp-3">
                <span class="text-primary-text">{{ username + ' contributed ' }}</span>
                {{ amount.formatedAmount + ' ' + amount.symbol }}
                <span class="text-primary-text"> to </span>{{ title }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { formatDate } from '@/common/timeStamp';
import { Vue, Options } from 'vue-class-component';
import Vue3Autocounter from 'vue3-autocounter';

@Options({
    components: { Vue3Autocounter },
    props: {
        imageUrl: String,
        timestamp: String,
        title: String,
        username: String,
        amount: Object,
    },
})
export default class GitcoinCard extends Vue {
    timestamp!: string;

    get date() {
        return this.timestamp ? formatDate(this.timestamp) : '';
    }
}
</script>

<style></style>
