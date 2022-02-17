import 'boxicons/css/boxicons.min.css'; // boxicons
import '@/assets/main.css';
import { createApp } from 'vue';
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
        appName: 'Pass3',
        pageTrackerScreenviewEnabled: true,
    },
    router,
);

app.use(Hotjar, {
    id: '2541834', // Hotjar Site ID
});

/* IFTRUE_isNDevelop */
Sentry.init({
    app,
    dsn: 'https://19adad3122ef486cbd3201112af00024@sentry.rss3.dev/2',
    integrations: [
        new Integrations.BrowserTracing({
            routingInstrumentation: Sentry.vueRouterInstrumentation(router),
            tracingOrigins: [/^(.+\.)?cheers\.bio/, /^\//],
        }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.2,
});
/* FITRUE_isNDevelop */

app.mount('#app');
