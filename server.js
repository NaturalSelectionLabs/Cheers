const defaultAvatar = '';

const Koa = require('koa');
const Router = require('@koa/router');
const CORS = require('@koa/cors');
const koaViews = require('koa-views');
const koaStatic = require('koa-static');
const path = require('path');
const axios = require('axios');

const app = new Koa();
app.use(CORS());

app.use(koaStatic(path.join(__dirname, 'dist')));

app.use(
    koaViews(path.join(__dirname, 'dist'), {
        extension: 'ejs',
    }),
);

const getName = async (host, url) => {
    if (host.split('.').length > 2) {
        return /^(.+?)\.rss3\.[^.]+$/.exec(host)[1];
    } else {
        return /^\/(.+?)\//.exec(url + '/')?.[1];
    }
};

const getAddress = async (name) => {
    if (/^0x[a-fA-F0-9]{40}$/.test(name)) {
        return name;
    } else {
        try {
            return (await axios.get(`https://rss3.domains/name/${name}`)).data.address;
        } catch (e) {
            console.log(e);
            return '';
        }
    }
};

const getPersona = async (address) => {
    try {
        return (await axios.get(`https://hub.pass3.me/${address}`)).data;
    } catch (e) {
        console.log(e);
        return null;
    }
};

const router = new Router();

const injectMetadata = async (ctx) => {
    // extract name
    const name = await getName(ctx.host, ctx.url);

    // get address
    let address = '';
    if (name) {
        address = await getAddress(name);
    }

    // request for persona
    let persona = {};
    if (address) {
        persona = await getPersona(address);
    }

    // embed default data (so page don't need to request again)
    await ctx.render('index', {
        user: JSON.stringify(persona),
        title: (persona?.profile?.name ? persona?.profile?.name + "'s " : '') + 'RSS3.Bio',
        avatar: persona?.profile?.avatar?.[0] || defaultAvatar,
        bio: persona?.profile?.bio?.replace(/\n/g, ' ') || 'RSS3.Bio',
        url: ctx.request.href.replace('http://', 'https://'),
    });
};

router.get('/(.*)', injectMetadata);

app.use(router.routes()).use(router.allowedMethods());

console.log('Server start...');

app.listen(process.env.PORT || 8080);
