let news = require('./controllers/news');
let compress = require('koa-compress');
let route = require('koa-route');
let koa = require('koa');
import { logger, responseTime } from './utility';
let requests = require('koa-log-requests');
let app = module.exports = koa();
let port = (process.env.PORT || 3000);

requests.indent = 2; // insert N spaces at the beginning
requests.format = ':method :path status=:status time=:time body=:body';
requests.filter = ['/favicon.ico']; // filter out these keys from request body

// Logger
app.use(logger);
app.use(requests());
app.use(responseTime);

app.use(route.get('/', news.feed));

// Compress
app.use(compress());

if (!module.parent) {
  app.listen(port);
  console.log('listening on port ' + port);
}
