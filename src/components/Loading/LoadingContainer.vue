<template>
    <div class="fixed left-0 top-0 flex items-center justify-center m-0 p-0 w-screen h-screen bg-black bg-opacity-30">
        <div class="body flex flex-col gap-56 items-center justify-start px-4 h-1/3">
            <Loading :size="200" :isLooping="isLooping" />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Loading from '@/components/Loading/Loading.vue';
@Options({
    props: {
        isLooping: Boolean,
    },
    components: {
        Loading,
    },
})
export default class LoadingContainer extends Vue {}
</script>

<style lang="postcss" scoped></style>
