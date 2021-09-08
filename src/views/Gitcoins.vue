<template>
    <div class="h-screen bg-gitcoin-bg overflow-y-auto">
        <div class="main px-4 py-8 max-w-md m-auto">
            <div class="header flex justify-between items-center pb-4">
                <Button size="sm" class="w-10 h-10 bg-white text-primary shadow-secondary" @click="back">
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
                <div class="section-title text-2xl text-gitcoin-title font-bold text-center">Donations</div>
                <ImgHolder
                    class="w-10 h-10 inline-flex my-auto cursor-pointer"
                    :is-rounded="true"
                    :is-border="false"
                    src="https://i.imgur.com/GdWEt4z.jpg"
                    alt="nya"
                    @click="toPublicPage(this.rss3Profile.address)"
                />
            </div>
            <div class="gitcoin-list flex flex-col gap-y-4">
                <GitcoinTitle :grants="1" :contributions="1"></GitcoinTitle>
                <GitcoinCard imageUrl="https://i.imgur.com/GdWEt4z.jpg" name="testing" :contrib="1"></GitcoinCard>
            </div>
            <div
                class="px-4 py-4 flex gap-5 fixed bottom-0 left-0 right-0 max-w-md m-auto w-full"
                v-if="isOwner && list.length > 0"
            >
                <Button
                    size="lg"
                    class="m-auto text-lg bg-gitcoin-button text-white shadow-gitcoin"
                    @click="toSetupGitcoins"
                >
                    Manage Contribs
                </Button>
            </div>
            <div
                class="px-4 py-4 flex gap-5 fixed bottom-0 left-0 right-0 max-w-md m-auto w-full"
                v-if="list.length == 0"
            >
                <Button size="lg" class="m-auto text-lg bg-gitcoin-button text-white shadow-gitcoin">
                    Go to Gitcoin
                </Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import ImgHolder from '@/components/ImgHolder.vue';
import GitcoinTitle from '@/components/GitcoinTitle.vue';
import GitcoinCard from '@/components/GitcoinCard.vue';

@Options({
    components: { ImgHolder, Button, GitcoinTitle, GitcoinCard },
})
export default class Gitcoins extends Vue {
    public list: Array<Object> = [{}];
    public isOwner: boolean = true;

    public toPublicPage(address: string) {
        this.$router.push(`/${address}`);
    }

    public back() {
        window.history.back();
    }

    public toSetupGitcoins() {
        this.$router.push(`/setup/gitcoins`);
    }
}
</script>

<style></style>
