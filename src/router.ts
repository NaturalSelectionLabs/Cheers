import { createRouter, createWebHistory } from 'vue-router';

import Index from '@/views/Index.vue';
import Test from '@/views/Test.vue';
import Setup from '@/views/Setup.vue';
import SetupAccounts from '@/views/SetupAccounts.vue';
import SetupNfts from '@/views/SetupNfts.vue';
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
        path: '/setup',
        component: Setup,
    },
    {
        path: '/setup/accounts',
        component: SetupAccounts,
    },
    {
        path: '/setup/nfts',
        component: SetupNfts,
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
        path: '/:address/followers',
        name: 'Followers',
        component: Followers,
    },
    {
        path: '/:address/followings',
        name: 'Followings',
        component: Followings,
    },
    {
        path: '/:address/accounts',
        name: 'Accounts',
        component: Accounts,
    },
    {
        path: '/:address/nfts',
        name: 'NFTs',
        component: NFTs,
    },
    {
        path: '/:address/singlenft/:aid/:id',
        name: 'SingleNFT',
        component: Singlenft,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
