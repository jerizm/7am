import {getLatestFeed, feed} from './controllers/news';
import compress from 'koa-compress';
import route from 'koa-route';
import koa from 'koa';
import logger from 'koa-logger';
import { responseTime } from './utility';
import requests from 'koa-log-requests';
import debug from 'debug';
import co from 'co';
import config from './config/init';

const app = module.exports = koa();
const port = (process.env.PORT || 3000);

requests.indent = 2; // insert N spaces at the beginning
requests.format = ':method :path status=:status time=:time body=:body';
requests.filter = ['/favicon.ico']; // filter out these keys from request body

// loop get latest feed
setInterval(() => {
  co(function* getFeed() {
    return yield getLatestFeed();
  });
}, config.interval);

// Logger
app.use(logger());
app.use(requests());
app.use(responseTime);

app.use(route.get('/', feed));

// Compress
app.use(compress());

app.listen(port);
debug('dev')('listening on port ' + port);
