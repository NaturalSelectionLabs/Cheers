import { createRouter, createWebHistory } from 'vue-router';

import Index from '@/views/Index.vue';
import Setup from '@/views/Setup.vue';
import SetupAccounts from '@/views/SetupAccounts.vue';
import SetupNfts from '@/views/SetupNfts.vue';

import Test from '@/views/Test.vue';

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
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
