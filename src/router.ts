import { createRouter, createWebHistory } from 'vue-router';

import Index from '@/views/Index.vue';
import Test from '@/views/Test.vue';
import Home from '@/views/Home.vue';
import Followings from '@/views/Followings.vue';
import Followers from '@/views/Followers.vue';
import Accounts from '@/views/Accounts.vue';
import NFTs from '@/views/NFTs.vue';
import SingleNFT from '@/views/SingleNFT.vue';
import Setup from '@/views/Setup/Setup.vue';
import SetupAccounts from '@/views/Setup/SetupAccounts.vue';
import SetupNFTs from '@/views/Setup/SetupNFTs.vue';
import RNS from '@/views/Setup/RNS.vue';

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
        path: '/:address',
        component: Home,
    },
    {
        path: '/home',
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
        component: SingleNFT,
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
        component: SetupNFTs,
    },
    {
        path: '/rns',
        component: RNS,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
