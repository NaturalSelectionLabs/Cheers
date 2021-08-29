import { createApp } from 'vue';
import 'boxicons/css/boxicons.min.css';

import '@/assets/main.css';
import 'boxicons/css/boxicons.min.css'; // boxicons
import App from './App.vue';
import router from './router';
import VueGtag from 'vue-gtag';
import Hotjar from 'vue-hotjar';
import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';

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

Sentry.init({
    app,
    dsn: 'https://82351be1cb9a445e87c3c7183bc13d9f@o947126.ingest.sentry.io/5936111',
    integrations: [
        new Integrations.BrowserTracing({
            routingInstrumentation: Sentry.vueRouterInstrumentation(router),
            tracingOrigins: [/^.+\.pass3\.me/, 'pass3.me', /^\//],
        }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

app.mount('#app');
