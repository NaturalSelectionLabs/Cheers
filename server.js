const defaultAvatar = '';

const Koa = require('koa');
const Router = require('@koa/router');
const CORS = require('@koa/cors');
const koaViews = require('koa-views');
const koaStatic = require('koa-static');
const path = require('path');
const axios = require('axios');
// const compress = require('koa-compress');
const { default: sslify, xForwardedProtoResolver } = require('koa-sslify');

const app = new Koa();
app.use(
    sslify({
        resolver: xForwardedProtoResolver,
    }),
);
app.use(CORS());
// app.use(compress());

app.use(koaStatic(path.join(__dirname, 'dist')));

app.use(
    koaViews(path.join(__dirname, 'dist'), {
        extension: 'ejs',
    }),
);

const getName = async (host, url) => {
    if (host.split('.').length > 2) {
        return host.split('.').slice(0, -2).join('.');
    } else {
        return /^\/(.+?)\//.exec(url + '/')?.[1];
    }
};

const getAddress = async (name) => {
    try {
        return (await axios.get(`https://rss3.domains/name/${name}`)).data.address;
    } catch (e) {
        console.log(e);
        return '';
    }
};

const router = new Router();

const injectMetadata = async (ctx) => {
    // extract name
    const host = ctx.host;
    const aon = await getName(host, ctx.url);

    let address = '';
    if (aon) {
        // get address
        if (/^0x[a-fA-F0-9]{40}$/.test(aon)) {
            // Is address
            address = aon;
        } else {
            address = await getAddress(aon);
        }
    }

    // Redirect to RSS3.io
    if (address && parseInt(address, 16) !== 0) {
        await ctx.redirect(`https://rss3.io/result?search=${address}`);
    } else if (typeof aon !== 'undefined') {
        await ctx.redirect(`https://rss3.io/result?search=${aon}`);
    } else {
        await ctx.redirect(`https://rss3.io/`);
    }
};

router.get('/(.*)', injectMetadata);

app.use(router.routes()).use(router.allowedMethods());

console.log('Server start...');

app.listen(process.env.PORT || 8080);
