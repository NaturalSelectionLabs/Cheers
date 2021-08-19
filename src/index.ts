import { createApp } from 'vue';
import 'boxicons/css/boxicons.min.css';

import '@/assets/main.css';
import 'boxicons/css/boxicons.min.css'; // boxicons
import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(router);

app.mount('#app');
