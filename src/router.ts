import config from '@/config';
import Accounts from '@/views/Account/Accounts.vue';
import SetupAccounts from '@/views/Account/SetupAccounts.vue';
import Gitcoins from '@/views/Donation/Gitcoins.vue';
import SetupGitcoins from '@/views/Donation/SetupGitcoins.vue';
import SingleGitcoin from '@/views/Donation/SingleGitcoin.vue';
import Followers from '@/views/Follow/Followers.vue';
import Followings from '@/views/Follow/Followings.vue';
import Footprints from '@/views/Footprint/Footprints.vue';
import SetupFootprints from '@/views/Footprint/SetupFootprints.vue';
import SingleFootprint from '@/views/Footprint/SingleFootprint.vue';
import Home from '@/views/Home.vue';
import Index from '@/views/Index.vue';
import NFTs from '@/views/NFT/NFTs.vue';
import SetupNFTs from '@/views/NFT/SetupNFTs.vue';
import SingleNFT from '@/views/NFT/SingleNFT.vue';
import EditProfile from '@/views/Setup/EditProfile.vue';
import RNS from '@/views/Setup/RNS.vue';
import RNSPending from '@/views/Setup/RNSPending.vue';
import Setup from '@/views/Setup/Setup.vue';
import { createRouter, createWebHistory } from 'vue-router';

export const routes = [
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
        path: (config.subDomain.isSubDomainMode ? '' : '/:address') + '/singlenft/:platform/:identity/:id/:type',
        name: 'SingleNFT',
        component: SingleNFT,
    },
    {
        path: (config.subDomain.isSubDomainMode ? '' : '/:address') + '/singlegitcoin/:platform/:identity/:id/:type',
        name: 'SingleGitcoin',
        component: SingleGitcoin,
    },

    {
        path: (config.subDomain.isSubDomainMode ? '' : '/:address') + '/singlefootprint/:platform/:identity/:id/:type',
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
        path: '/setup/Footprints',
        name: 'SetupFootprints',
        component: SetupFootprints,
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
