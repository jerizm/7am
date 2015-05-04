'use strict';
var news = require('./controllers/news');
var compress = require('koa-compress');
var logger = require('koa-logger');
var route = require('koa-route');
var koa = require('koa');
var path = require('path');
var app = module.exports = koa();
var port = (process.env.PORT || 3000);
// Logger
app.use(logger());

app.use(route.get('/', news.feed));

// Compress
app.use(compress());

if (!module.parent) {
  app.listen(port);
  console.log('listening on port ' + port);
}
