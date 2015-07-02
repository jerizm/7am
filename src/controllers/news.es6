import moment from 'moment-timezone';
import fs from 'co-fs';
import {parseRss, createFeed} from '../utility';
import debug from 'debug';
import config from '../config/init';

export let feed = function *feed() {
  let now = moment.tz(config.timezone);
  let xmlFeed = yield fs.readFile(config.cacheFile, 'utf8');
  this.set('content-type', 'text/xml;charset=UTF-8');
  this.set('cache-control', 'max-age=0');
  this.set('expires', now.utc().toDate().toString());
  this.body = xmlFeed;
};

let lastSeen = null;

export let getLatestFeed = function *getLatestFeed() {
  let now = moment.tz(config.timezone);
  let current = now.date() + '' + now.hour();
  if (config.newsTime.indexOf(now.hour()) &&
    lastSeen !== current) {
    let xmlFeed = '';
    let result = yield parseRss(config.newsUrl);
    let entry = result[0];
    let pubdate = moment.tz(entry.pubdate, config.timezone);
    // check if it's actually newsTimes
    if (config.newsTime.indexOf(pubdate.hour()) >= 0) {
      debug('dev')('getting feed ' + pubdate);
      lastSeen = current;
      xmlFeed = createFeed(entry, pubdate).xml();
      fs.writeFile(config.cacheFile, xmlFeed);
      return true;
    }
  }
  debug('dev')('not current feed');
  return false;
};
