<template>
    <div class="flex flex-row items-center justify-start w-full text-body-text border-card rounded-2xl cursor-pointer">
        <div
            class="flex-shrink m-0.5 w-22 h-22 bg-white bg-cover bg-center bg-no-repeat rounded-2xl md:w-28 md:h-28"
            :style="{ backgroundImage: `url(${imageUrl})` }"
        />
        <div class="flex-1 pl-8 w-0 text-sm md:text-base">
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
        amount: Array,
    },
})
export default class GitcoinCard extends Vue {
    timestamp!: string;
    date: string = '';

    mounted() {
        this.date = formatDate(this.timestamp);
    }
}
</script>

<style></style>
