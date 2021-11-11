const defaultAvatar = '';

const Koa = require('koa');
const Router = require('@koa/router');
const koaViews = require('koa-views');
const koaStatic = require('koa-static');
const path = require('path');

const app = new Koa();

app.use(koaStatic(path.join(__dirname, 'dist')));

app.use(
    koaViews(path.join(__dirname, 'dist'), {
        extension: 'ejs',
    }),
);

const router = new Router();

const injectMetadata = async (ctx) => {
    // todo: finish this

    // extract username / address

    // request for persona

    // embed default data (so page don't need to request again)

    await ctx.render('index', {
        user: JSON.stringify(persona),
        title: persona.profile?.name || '', //<% if (username) { %><-% username %>'s <% } %>RSS3.bio
        avatar: persona.profile?.avatar?.[0] || defaultAvatar,
        bio: persona.profile?.bio || '',
        hostname: ctx.request.hostname,
    });
};

router.get('/(.*)', injectMetadata);

app.use(router.routes()).use(router.allowedMethods());

console.log('Dev server start...');

app.listen(8080);
