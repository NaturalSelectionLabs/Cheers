<template>
    <div class="main px-4 py-8 flex flex-col gap-y-2">
        <Profile
            :avatar="rss3Profile.avatar"
            :username="rss3Profile.username"
            :address="rss3Profile.address"
            :followers="rss3Relations.followers"
            :followings="rss3Relations.followings"
            :bio="rss3Profile.bio"
        ></Profile>
        <Button
            v-if="isFollowing"
            size="sm"
            class="w-auto text-lg bg-primary text-white shadow-secondary mb-4"
            @click="isFollowing = !isFollowing"
        >
            <span>Follow</span>
            <i class="bx bx-plus bx-sm"></i>
        </Button>
        <Button
            v-else
            size="sm"
            class="w-auto text-lg bg-white text-primary shadow-secondary mb-4"
            @click="isFollowing = !isFollowing"
        >
            <span>Following</span>
            <i class="bx bx-check bx-sm"></i>
        </Button>

        <Card
            title="Accounts"
            color-title="text-account-title"
            color-tips="text-account-title"
            color-background="bg-account-bg"
            class="w-auto"
            :is-having-content="true"
            :is-single-line="true"
        >
            <template #accessibility>
                <i class="bx bx-info-circle" style="color: rgba(0, 0, 0, 0.2)" />
            </template>
            <template #header-button>
                <Button size="sm" class="w-10 h-10 text-account-button bg-white shadow-account-sm">
                    <i class="bx bx-expand-alt bx-xs"></i>
                </Button>
            </template>
            <template #content>
                <ImgHolder
                    v-for="id in 8"
                    :key="id"
                    class="w-16 h-16 shadow-account-sm inline-flex m-0.5"
                    :is-rounded="true"
                    :is-border="true"
                    src="https://i.imgur.com/GdWEt4z.jpg"
                    alt="nya"
                />
            </template>
        </Card>

        <Card
            title="NFTs"
            color-title="text-nft-title"
            color-tips="text-nft-title"
            color-background="bg-nft-bg"
            class="w-auto"
            :is-having-content="true"
            :is-single-line="true"
        >
            <template #accessibility>
                <i class="bx bx-info-circle" style="color: rgba(0, 0, 0, 0.2)" />
            </template>
            <template #header-button>
                <Button size="sm" class="w-10 h-10 text-nft-button bg-white shadow-nft-sm">
                    <i class="bx bx-expand-alt bx-xs"></i>
                </Button>
            </template>
            <template #content>
                <ImgHolder
                    v-for="id in 8"
                    :key="id"
                    class="w-16 h-16 shadow-nft-sm inline-flex m-0.5"
                    :is-square="true"
                    :isBorder="true"
                    src="https://i.imgur.com/GdWEt4z.jpg"
                    alt="nya"
                />
            </template>
        </Card>

        <Card
            title="Content"
            color-title="text-content-title"
            color-tips="text-content-title"
            color-background="bg-content-bg"
            class="w-auto"
            :is-having-content="true"
        >
            <template #accessibility>
                <i class="bx bx-info-circle" style="color: rgba(0, 0, 0, 0.2)" />
            </template>
            <template #content>
                <Button
                    size="sm"
                    class="
                        text-xs
                        bg-content-button
                        opacity-35
                        text-white
                        shadow-content
                        cursor-not-allowed
                        m-auto
                        mt-4
                    "
                    disabled
                >
                    Coming Soon
                </Button>
            </template>
        </Card>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import ImgHolder from '@/components/ImgHolder.vue';
import Card from '@/components/Card.vue';
import Profile from '@/components/Profile.vue';

@Options({
    components: { ImgHolder, Button, Card, Profile },
})
export default class Home extends Vue {
    public isFollowing: boolean = true;
    public rss3Profile: Object = {
        avatar: 'https://i.imgur.com/GdWEt4z.jpg',
        username: 'Fendiiii',
        address: '98765tgdusgakdgetg',
        bio: 'Cutest cat in the world',
    };
    public rss3Relations: Object = {
        followers: [
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
        ],
        followings: [
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
        ],
    };
}
</script>

<style></style>
