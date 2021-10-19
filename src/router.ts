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
import SingleFootprint from '@/views/SingleFootprint.vue';
import config from '@/config';
import Footprints from '@/views/Footprints.vue';

export const routes = [
    /* IFTRUE_isDevelop */
    {
        path: '/test',
        name: 'Test',
        component: Test,
    },
    /* FITRUE_isDevelop */
    config.subDomain.isSubDomainMode
        ? {
              path: '/',
              name: 'OwnedHome',
              component: Home,
          }
        : {
              path: '/:address',
              name: 'NamedHome',
              component: Home,
          },
    {
        path: (config.subDomain.isSubDomainMode ? '' : '/:address') + '/followers',
        name: 'Followers',
        component: Followers,
    },
    {
        path: (config.subDomain.isSubDomainMode ? '' : '/:address') + '/followings',
        name: 'Followings',
        component: Followings,
    },
    {
        path: (config.subDomain.isSubDomainMode ? '' : '/:address') + '/accounts',
        name: 'Accounts',
        component: Accounts,
    },
    {
        path: (config.subDomain.isSubDomainMode ? '' : '/:address') + '/nfts',
        name: 'NFTs',
        component: NFTs,
    },
    {
        path: (config.subDomain.isSubDomainMode ? '' : '/:address') + '/singlenft/:platform/:identity/:id',
        name: 'SingleNFT',
        component: SingleNFT,
    },
    {
        path: (config.subDomain.isSubDomainMode ? '' : '/:address') + '/gitcoins',
        name: 'Gitcoins',
        component: Gitcoins,
    },
    {
        path: (config.subDomain.isSubDomainMode ? '' : '/:address') + '/footprints',
        name: 'Footprints',
        component: Footprints,
    },
    {
        path: (config.subDomain.isSubDomainMode ? '' : '/:address') + '/singlegitcoin/:platform/:identity/:id',
        name: 'SingleGitcoin',
        component: SingleGitcoin,
    },

    {
        path: '/singlefootprint',
        name: 'SingleFootprint',
        component: SingleFootprint,
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

if (!config.subDomain.isSubDomainMode) {
    routes.push({
        path: '/',
        name: 'Index',
        component: Index,
    });
}

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
