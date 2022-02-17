<template>
    <div
        class="flex flex-col items-start justify-center gap-1 rounded-sm border-card bg-primary-btn bg-opacity-10 px-5 py-3 leading-none text-body-text"
    >
        <div class="text-xs font-normal uppercase">{{ traitType }}</div>
        <div class="text-sm font-medium capitalize">{{ traitValue }}</div>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

@Options({
    props: {
        traitType: String,
        traitValue: String,
    },
})
export default class Trait extends Vue {
    traitType!: String;
    traitValue!: String;
}
</script>

<style></style>
