import { createApp } from 'vue';
import 'boxicons/css/boxicons.min.css';

import '@/assets/main.css';
import 'boxicons/css/boxicons.min.css'; // boxicons
import App from './App.vue';
import router from './router';
import VueGtag from 'vue-gtag';
import Hotjar from 'vue-hotjar';

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

app.use(Hotjar, {
    id: '2541834', // Hotjar Site ID
});

app.mount('#app');
