import { createApp } from 'vue';
import 'boxicons/css/boxicons.min.css';
import { VueReCaptcha } from 'vue-recaptcha-v3';

import '@/assets/main.css';
import 'boxicons/css/boxicons.min.css'; // boxicons
import App from './App.vue';
import router from './router';
import VueGtag from 'vue-gtag';
import Hotjar from 'vue-hotjar';
import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';
const app = createApp(App);

// import { Vue } from 'vue-class-component';
// Vue.registerHooks([
//     'beforeRouteEnter',//进入路由之前
//     'beforeRouteLeave',//离开路由之前
//     'beforeRouteUpdate'
// ]);

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

app.use(VueReCaptcha, {
    siteKey: '6LfhqhAdAAAAAJMQDy4P9Ohaim-Cu_WJoH_tOncQ',
    loaderOptions: {
        useRecaptchaNet: true,
    },
});

/* IFTRUE_isNDevelop */
Sentry.init({
    app,
    dsn: 'https://19adad3122ef486cbd3201112af00024@sentry.rss3.dev/2',
    integrations: [
        new Integrations.BrowserTracing({
            routingInstrumentation: Sentry.vueRouterInstrumentation(router),
            tracingOrigins: [/^(.+\.)?pass3\.me/, /^(.+\.)?rss3\.bio/, /^\//],
        }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.2,
});
/* FITRUE_isNDevelop */

app.mount('#app');
