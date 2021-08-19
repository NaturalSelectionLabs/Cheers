import { createRouter, createWebHistory } from 'vue-router';

import Index from '@/views/Index.vue';

import Test from '@/views/Test.vue';

const routes = [
    {
        path: '/',
        component: Index,
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
