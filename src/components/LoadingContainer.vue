<template>
    <div class="fixed w-screen h-screen m-0 p-0 top-0 left-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="body px-4 h-2/3 flex flex-col justify-start items-center gap-56">
            <Loading :size="200" />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Loading from '@/components/Loading.vue';
@Options({
    components: {
        Loading,
    },
})
export default class LoadingContainer extends Vue {}
</script>

<style lang="postcss" scoped></style>
