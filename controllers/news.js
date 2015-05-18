var parser = require('parse-rss');
var RSS = require('rss');
var moment = require('moment-timezone');
var timezone = 'America/New_York';
var fs = require('co-fs');
var newsTimes = [7, 17];
var lastSeen = null;

module.exports.feed = function *feed() {
  var now = moment.tz(timezone);
  var date = now.date();
  var hour = now.hour();
  var current = hour + '' + date;
  var xmlFeed = '';
  if(newsTimes.indexOf(hour) >= 0 &&
    lastSeen !== current)
  {
    var result = yield parseRss('http://www.npr.org/rss/podcast.php?id=500005');
    var entry = result[0];
    var pubdate = moment.tz(entry.pubdate, timezone);
    // check if it's actually newsTimes
    if(newsTimes.indexOf(pubdate.hour()) >= 0) {
      lastSeen = current;
      xmlFeed = createFeed(entry, pubdate).xml();
      fs.writeFile('cache.json', xmlFeed);
    }
  }
  else if(xmlFeed === ''){
    xmlFeed = yield fs.readFile('cache.json', 'utf8');
  }
  this.set('content-type', 'text/xml;charset=UTF-8');
  this.set('cache-control', 'max-age=0');
  var today = new Date();
  var UTCstring = today.toUTCString();
  this.set('expires', UTCstring);
  this.body = xmlFeed;
};

function createFeed(item, pubdate){
  /* lets create an rss feed */
  var rssFeed = new RSS({
    title: '7AM + 5PM ET News Summary',
    description: '<![CDATA[ A five-minute NPR News summary you can take with you. ]]>',
    image_url: 'http://media.npr.org/images/podcasts/2013/primary/7am_et_news_summary-72638a510ea23591a0e39f18db4188bc7fd58e24.png?s=200',
    link: 'http://www.npr.org/templates/topics/topic.php?topicId=1001',
    copyright: 'Copyright 2007 NPR - For Personal Use Only',
    language: 'en-us',
    categories: ['News & Politics'],
    pubDate: 'May 20, 2012 04:00:00 GMT',
    ttl: '60',
    custom_namespaces: {
      'itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd'
    },
    custom_elements: [
      {'itunes:subtitle': '<![CDATA[ A five-minute NPR News summary you can take with you. ]]>'},
      {'itunes:author': 'NPR'},
      {'itunes:summary': '<![CDATA[ A five-minute NPR News summary you can take with you. ]]>'},
      {'itunes:owner': [
        {'itunes:name': ''},
        {'itunes:email': ''}
      ]},
      {'itunes:image': {
        _attr: {
          href: 'http://media.npr.org/images/podcasts/2013/primary/7am_et_news_summary-72638a510ea23591a0e39f18db4188bc7fd58e24.png?s=1400'
        }
      }},
      {'itunes:category': [
        {_attr: {
          text: 'News & Politics'
        }}
      ]}
    ]
  });
  rssFeed.item({
    title: item.title,
    description: item.description,
    url: item.enclosures[0].url,
    guid: item.enclosures[0].url,
    categories: item.meta.categories,
    date: item.date,
    enclosure: item.enclosures[0],
    custom_elements: [
      {'itunes:author': 'NPR'},
      {'itunes:subtitle': 'NPR ' + pubdate.format('HA') + ' News Summary'},
      {'itunes:image': {
        _attr: {
          href: 'http://media.npr.org/images/podcasts/2013/primary/7am_et_news_summary-72638a510ea23591a0e39f18db4188bc7fd58e24.png?s=1400'
        }
      }}
    ]
  });
  return rssFeed;
}

function parseRss(url) {
  return function(callback) {
     parser(url, callback);
  };
}
