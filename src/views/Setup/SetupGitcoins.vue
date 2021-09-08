<template>
    <div class="px-4 py-9 max-w-md m-auto">
        <div class="flex justify-between items-center mb-4">
            <Button size="sm" class="w-10 h-10 bg-white text-primary shadow-secondary" @click="back">
                <i class="bx bx-chevron-left bx-sm" />
            </Button>
            <span class="text-center">
                <h1 class="text-xl text-gitcoin-title font-bold inline">Manage Donations</h1>
            </span>
            <span class="avatar">
                <ImgHolder
                    class="w-10 h-10 inline-flex my-auto cursor-pointer"
                    :is-rounded="true"
                    :is-border="false"
                    src="https://i.imgur.com/GdWEt4z.jpg"
                    alt="nya"
                />
            </span>
        </div>
        <Card
            title="Listed"
            color-title="text-gitcoin-title"
            color-tips="text-gitcoin-title"
            color-background="bg-gitcoin-bg"
            class="w-full mb-4"
        >
            <template #content> </template>
            <template #footer-button>
                <Button
                    size="sm"
                    class="text-xs bg-white text-gitcoin-button shadow-gitcoin-sm ml-auto"
                    :class="{
                        'bg-gray-100 cursor-not-allowed': show.length === 0,
                    }"
                    :disabled="show.length === 0"
                    @click="hideAll"
                >
                    Hide All
                </Button>
            </template>
        </Card>
        <Card
            title="Unlisted"
            color-title="text-gitcoin-title"
            color-tips="text-gitcoin-title"
            color-background="bg-gray-bg"
            class="w-full mb-4"
            :is-having-content="hide.length !== 0"
            :tips="hide.length === 0 ? 'Drag here to hide' : ''"
        >
            <template #accessibility>
                <i class="bx bx-info-circle" style="color: rgba(0, 0, 0, 0.2)" />
            </template>
            <template #header-button
                ><Button
                    size="sm"
                    class="text-xs bg-white text-gitcoin-button shadow-gitcoin-sm ml-auto"
                    :class="{
                        'bg-gray-100 cursor-not-allowed': hide.length === 0,
                    }"
                    :disabled="hide.length === 0"
                    @click="showAll"
                >
                    Show All
                </Button></template
            >
            <template #content> </template>
        </Card>

        <div class="px-4 py-4 flex gap-5 fixed bottom-0 left-0 right-0 max-w-md m-auto w-full">
            <Button size="lg" class="flex-1 text-lg bg-white text-primary shadow-secondary" @click="back"
                >Discard</Button
            >
            <Button size="lg" class="flex-1 text-lg bg-primary text-white shadow-primary" @click="save">Save</Button>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import Card from '@/components/Card.vue';
import draggable from 'vuedraggable';
import ImgHolder from '@/components/ImgHolder.vue';

@Options({
    components: {
        Button,
        Card,
        draggable,
        ImgHolder,
    },
})
export default class SetupGitcoins extends Vue {
    public show: Array<Object> = [{}];
    public hide: Array<Object> = [{}];

    showAll() {}

    hideAll() {}

    back() {
        window.history.back();
    }

    save() {}
}
</script>

<style lang="postcss" scoped></style>
