// import Koa from 'koa';
// import koaViews from 'koa-views';
// import koaStatic from 'koa-static';
//
// import path from 'path';

const Koa = require('koa');
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

app.use(async (ctx) => {
    const title = 'Web3 Pass';
    await ctx.render('index', {
        title,
    });
});

console.log('Dev server start...');

app.listen(8080);
