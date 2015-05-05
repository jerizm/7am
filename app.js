'use strict';
var news = require('./controllers/news');
var compress = require('koa-compress');
var logger = require('koa-logger');
var route = require('koa-route');
var koa = require('koa');
var path = require('path');
var utility = require('./utility');
var requests = require('koa-log-requests');
var app = module.exports = koa();
var port = (process.env.PORT || 3000);

requests.indent = 2; // insert N spaces at the beginning
requests.format = ':method :path status=:status time=:time body=:body'; // format of output
requests.filter = ['/favicon.ico']; // filter out these keys from request body

// Logger
app.use(utility.logger);
app.use(requests());
app.use(utility.responseTime);

app.use(route.get('/', news.feed));

// Compress
app.use(compress());

if (!module.parent) {
  app.listen(port);
  console.log('listening on port ' + port);
}
