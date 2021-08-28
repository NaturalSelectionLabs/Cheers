import { createApp } from 'vue';
import 'boxicons/css/boxicons.min.css';

import '@/assets/main.css';
import 'boxicons/css/boxicons.min.css'; // boxicons
import App from './App.vue';
import router from './router';
import VueGtag from 'vue-gtag';

const app = createApp(App);

app.use(router);

app.use(
    VueGtag,
    {
        config: { id: 'G-740EEBM023' },
        pageTrackerScreenviewEnabled: true,
    },
    router,
);

app.mount('#app');
