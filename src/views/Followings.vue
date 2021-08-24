<template>
    <div class="main px-4 py-8 max-w-md m-auto">
        <div class="header flex justify-between items-center pb-4">
            <Button size="sm" class="w-10 h-10 bg-white text-primary shadow-secondary">
                <i class="bx bx-chevron-left bx-sm"></i>
            </Button>
            <div class="section-title text-2xl text-primary font-bold text-center">Followings</div>
            <ImgHolder
                class="w-10 h-10 inline-flex my-auto"
                :is-rounded="true"
                :is-border="false"
                src="https://i.imgur.com/GdWEt4z.jpg"
                alt="nya"
            />
        </div>
        <div class="follow-list flex flex-col gap-y-2">
            <FollowerCard
                class="w-auto shadow-secondary"
                v-for="(item, index) in followList"
                :key="index"
                :avatar="item.avatar"
                :name="item.username"
                :address="item.address"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import ImgHolder from '@/components/ImgHolder.vue';
import FollowerCard from '@/components/FollowerCard.vue';

@Options({
    components: { ImgHolder, Button, FollowerCard },
})
export default class Followings extends Vue {
    public followList: Object = [
        {
            avatar: 'https://i.imgur.com/GdWEt4z.jpg',
            username: 'Fendiiii',
            address: '98765tgdusgakdgetg',
            bio: 'Cutest cat in the world',
        },
        {
            avatar: 'https://i.imgur.com/GdWEt4z.jpg',
            username: 'Fendiiii',
            address: '98765tgdusgakdgetg',
            bio: 'Cutest cat in the world',
        },
        {
            avatar: 'https://i.imgur.com/GdWEt4z.jpg',
            username: 'Fendiiii',
            address: '98765tgdusgakdgetg',
            bio: 'Cutest cat in the world',
        },
    ];
}
</script>

<style></style>
