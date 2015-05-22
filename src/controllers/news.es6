let moment = require('moment-timezone');
let timezone = 'America/New_York';
let fs = require('co-fs');
let newsTimes = [7, 17];
let lastSeen = null;
import { parseRss, createFeed } from '../utility';
const feedUrl = 'http://www.npr.org/rss/podcast.php?id=500005';

exports.feed = function *feed() {
  let now = moment.tz(timezone);
  let date = now.date();
  let hour = now.hour();
  let current = hour + '' + date;
  let xmlFeed = '';
  if (newsTimes.indexOf(hour) >= 0 &&
    lastSeen !== current) {
    let result = yield parseRss(feedUrl);
    let entry = result[0];
    let pubdate = moment.tz(entry.pubdate, timezone);
    // check if it's actually newsTimes
    if (newsTimes.indexOf(pubdate.hour()) >= 0) {
      lastSeen = current;
      xmlFeed = createFeed(entry, pubdate).xml();
      fs.writeFile('dist/cache.json', xmlFeed);
    }
  }
  else if (xmlFeed === '') {
    xmlFeed = yield fs.readFile('dist/cache.json', 'utf8');
  }
  this.set('content-type', 'text/xml;charset=UTF-8');
  this.set('cache-control', 'max-age=0');
  this.set('expires', now.utc().toDate().toString());
  this.body = xmlFeed;
};
