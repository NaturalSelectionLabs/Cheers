import config from '@/config';
const Accounts = () => import('@/views/Account/Accounts.vue');
const SetupAccounts = () => import('@/views/Account/SetupAccounts.vue');
const Gitcoins = () => import('@/views/Donation/Gitcoins.vue');
const SetupGitcoins = () => import('@/views/Donation/SetupGitcoins.vue');
const SingleGitcoin = () => import('@/views/Donation/SingleGitcoin.vue');
const Followers = () => import('@/views/Follow/Followers.vue');
const Followings = () => import('@/views/Follow/Followings.vue');
const Footprints = () => import('@/views/Footprint/Footprints.vue');
const SetupFootprints = () => import('@/views/Footprint/SetupFootprints.vue');
const SingleFootprint = () => import('@/views/Footprint/SingleFootprint.vue');
const Home = () => import('@/views/Home.vue');
const Index = () => import('@/views/Index.vue');
const NFTs = () => import('@/views/NFT/NFTs.vue');
const SetupNFTs = () => import('@/views/NFT/SetupNFTs.vue');
const SingleNFT = () => import('@/views/NFT/SingleNFT.vue');
const EditProfile = () => import('@/views/Setup/EditProfile.vue');
const RNS = () => import('@/views/Setup/RNS.vue');
const RNSPending = () => import('@/views/Setup/RNSPending.vue');
const Setup = () => import('@/views/Setup/Setup.vue');
const Invalid = () => import('@/views/Invalid.vue');
const Leaderboard = () => import('@/views/Leaderboard/Leaderboard.vue');
const Capsule = () => import('@/views/Capsule.vue');
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
const basePath = config.subDomain.isSubDomainMode ? '/' : '/:address/';

export const routes: RouteRecordRaw[] = [
    {
        path: basePath,
        name: 'Home',
        component: Home,
    },
    {
        path: basePath + 'followers',
        name: 'Followers',
        component: Followers,
    },
    {
        path: basePath + 'followings',
        name: 'Followings',
        component: Followings,
    },
    {
        path: basePath + 'leaderboard',
        name: 'Leaderboard',
        component: Leaderboard,
    },
    {
        path: basePath + 'accounts',
        name: 'Accounts',
        component: Accounts,
    },
    {
        path: basePath + '/nfts/:type',
        name: 'NFTs',
        component: NFTs,
    },
    {
        path: basePath + 'gitcoins',
        name: 'Gitcoins',
        component: Gitcoins,
    },
    {
        path: basePath + 'footprints',
        name: 'Footprints',
        component: Footprints,
    },
    {
        path: basePath + 'singlenft/:platform/:identity/:id/:type',
        name: 'SingleNFT',
        component: SingleNFT,
    },
    {
        path: basePath + 'singlegitcoin/:platform/:identity/:id/:type',
        name: 'SingleGitcoin',
        component: SingleGitcoin,
    },

    {
        path: basePath + 'singlefootprint/:platform/:identity/:id/:type',
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
    {
        path: '/invalid',
        name: 'Invalid',
        component: Invalid,
    },
    {
        path: '/capsule',
        name: 'Capsule',
        component: Capsule,
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
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0, left: 0 };
        }
    },
});

export default router;
