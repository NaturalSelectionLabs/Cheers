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
import GoToPC from '@/views/Setup/GoToPC.vue';
import Gitcoins from '@/views/Gitcoins.vue';
import SetupGitcoins from '@/views/Setup/SetupGitcoins.vue';
import SingleGitcoin from '@/views/SingleGitcoin.vue';

export const routes = [
    {
        path: '/',
        component: Index,
    },
    /* IFTRUE_isDevelop */
    {
        path: '/test',
        component: Test,
    },
    /* FITRUE_isDevelop */
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
        path: '/:address/singlenft/:platform/:identity/:id',
        name: 'SingleNFT',
        component: SingleNFT,
    },
    {
        path: '/:address/gitcoins',
        component: Gitcoins,
    },
    {
        path: '/:address/singlegitcoin/:platform/:identity/:id',
        component: SingleGitcoin,
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
        path: '/setup/gitcoins',
        component: SetupGitcoins,
    },
    {
        path: '/rns',
        component: RNS,
    },
    {
        path: '/profile',
        component: EditProfile,
    },
    {
        path: '/pending',
        component: RNSPending,
    },
    {
        path: '/gotopc',
        component: GoToPC,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
