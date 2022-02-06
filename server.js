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

const getNameByAddress = async (address) => {
    try {
        const name = (await axios.get(`https://rss3.domains/address/${address}`)).data;
        return name?.rnsName.replace('.rss3', '') || name?.dasName || name?.ensName || '';
    } catch (e) {
        console.log(e);
        return '';
    }
};

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

const getPersona = async (address) => {
    try {
        return (await axios.get(`https://prenode.rss3.dev/${address}`)).data;
    } catch (e) {
        console.log(e);
        return null;
    }
};

const router = new Router();

const injectMetadata = async (ctx) => {
    // extract name
    const host = ctx.host;
    const url = ctx.url;
    const aon = await getName(host, url);

    let address = '';
    // get address
    if (/^0x[a-fA-F0-9]{40}$/.test(aon)) {
        // try whether can use name
        const name = await getNameByAddress(aon);
        if (name) {
            // redirect to name
            const rootDomain = host.split('.').slice(-2).join('.');
            const newURL = url.replace(`${rootDomain}/${aon}`, `${name}.${rootDomain}`);

            ctx.response.redirect(newURL);
            return;
        } else {
            // no name found, use address
            address = aon;
        }
    } else {
        address = await getAddress(aon);
    }

    // request for persona
    let persona = {};
    if (address) {
        persona = await getPersona(address);
    }

    // embed default data (so page don't need to request again)
    await ctx.render('index', {
        user: JSON.stringify(persona),
        title: (persona?.profile?.name ? persona?.profile?.name + "'s " : '') + 'Cheers.Bio',
        avatar: persona?.profile?.avatar?.[0]?.replace('ipfs://', 'https://ipfs.io/ipfs/') || defaultAvatar,
        bio: persona?.profile?.bio?.replace(/\n/g, ' ') || 'Cheers.Bio',
        url: ctx.request.href.replace('http://', 'https://'),
    });
};

router.get('/(.*)', injectMetadata);

app.use(router.routes()).use(router.allowedMethods());

console.log('Server start...');

app.listen(process.env.PORT || 8080);
