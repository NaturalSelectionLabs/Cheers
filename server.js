// import Koa from 'koa';
// import koaViews from 'koa-views';
// import koaStatic from 'koa-static';
//
// import path from 'path';

const Koa = require('koa');
const Router = require('@koa/router');
const koaViews = require('koa-views');
const koaStatic = require('koa-static');
const path = require('path');
const fs = require('fs');

const app = new Koa();

app.use(koaStatic(path.join(__dirname, 'dist')));

app.use(
    koaViews(path.join(__dirname, 'dist'), {
        extension: 'ejs',
    }),
);

const router = new Router();

const indexPage = fs.readFileSync(path.join(__dirname, 'dist/index.ejs'));
const jsReqParam = indexPage.toString().match(/<script defer src="(.*)"><\/script>/)[1];

const injectMetadata = async (ctx) => {
    await ctx.render('index', {
        content: `<div id='app'></div><script defer src='${jsReqParam}'></script>`,
        user: '',
        player: ctx.request.hostname,
    });
};

router.get('/(.*)', injectMetadata);

app.use(router.routes()).use(router.allowedMethods());

console.log('Dev server start...');

app.listen(8080);
