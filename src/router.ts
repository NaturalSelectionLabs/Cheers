import { createRouter, createWebHistory } from 'vue-router';

import Index from '@/views/Index.vue';
import Test from '@/views/Test.vue';
import Home from '@/views/Home.vue';
import Followings from '@/views/Followings.vue';
import Followers from '@/views/Followers.vue';
import Accounts from '@/views/Accounts.vue';
import NFTs from '@/views/NFTs.vue';
import Singlenft from '@/views/SingleNFT.vue';

const routes = [
    {
        path: '/',
        component: Index,
    },
    {
        path: '/test',
        component: Test,
    },

    {
        path: '/public',
        component: Home,
    },
    {
        path: '/followings',
        component: Followings,
    },
    {
        path: '/followers',
        component: Followers,
    },
    {
        path: '/accounts',
        component: Accounts,
    },
    {
        path: '/nfts',
        component: NFTs,
    },
    {
        path: '/singlenft',
        component: Singlenft,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
