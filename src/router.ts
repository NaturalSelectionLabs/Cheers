import { createRouter, createWebHistory } from 'vue-router';

import Index from '@/views/Index.vue';
/* IFTRUE_isDevelop */
import Test from '@/views/Test.vue';
/* FITRUE_isDevelop */
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
import EditProfile from '@/views/EditProfile.vue';
import RNSPending from '@/views/Setup/RNSPending.vue';
import Gitcoins from '@/views/Gitcoins.vue';
import SetupGitcoins from '@/views/Setup/SetupGitcoins.vue';
import SingleGitcoin from '@/views/SingleGitcoin.vue';

export const routes = [
    {
        path: '/',
        name: 'Index',
        component: Index,
    },
    /* IFTRUE_isDevelop */
    {
        path: '/test',
        name: 'Test',
        component: Test,
    },
    /* FITRUE_isDevelop */
    {
        path: '/:address',
        name: 'NamedHome',
        component: Home,
    },
    {
        path: '/home',
        name: 'OwnedHome',
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
        path: '/:address/singlenft/:platform/:identity/:id',
        name: 'SingleNFT',
        component: SingleNFT,
    },
    {
        path: '/:address/gitcoins',
        name: 'Gitcoins',
        component: Gitcoins,
    },
    {
        path: '/:address/singlegitcoin/:platform/:identity/:id',
        name: 'SingleGitcoin',
        component: SingleGitcoin,
    },
    {
        path: '/setup',
        name: 'Setup',
        component: Setup,
    },
    {
        path: '/setup/accounts',
        name: 'SetupAccounts',
        component: SetupAccounts,
    },
    {
        path: '/setup/nfts',
        name: 'SetupNFTs',
        component: SetupNFTs,
    },

    {
        path: '/setup/gitcoins',
        name: 'SetupGitcoins',
        component: SetupGitcoins,
    },
    {
        path: '/rns',
        name: 'RNS',
        component: RNS,
    },
    {
        path: '/profile',
        name: 'EditProfile',
        component: EditProfile,
    },
    {
        path: '/pending',
        name: 'RNSPending',
        component: RNSPending,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
