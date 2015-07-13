/*jshint camelcase: false */
import parser from 'parse-rss';
import RSS from 'rss';

export let parseRss = function parseRss(url) {
  return (callback) => {
    parser(url, callback);
  };
};

export let createFeed = function createFeed(item, pubdate) {
  /* lets create an rss feed */
  let rssFeed = new RSS({
    title: '7AM ET News Summary',
    description: '<![CDATA[ A five-minute NPR News ' +
      ' summary you can take with you. ]]>',
    image_url: 'http://media.npr.org/images/podcasts/2013/primary/' +
      '7am_et_news_summary-72638a510ea23591a0e39f18db4188bc7fd58e24.png?s=200',
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
      {'itunes:subtitle': '<![CDATA[ A five-minute NPR News' +
        ' summary you can take with you. ]]>'},
      {'itunes:author': 'NPR'},
      {'itunes:summary': '<![CDATA[ A five-minute NPR News' +
        ' summary you can take with you. ]]>'},
      {'itunes:owner': [
        {'itunes:name': ''},
        {'itunes:email': ''}
      ]},
      {'itunes:image': {
        _attr: {
          href: 'http://media.npr.org/images/podcasts/2013/primary/7am_et_' +
            'news_summary-72638a510ea23591a0e39f18db4188bc7fd58e24.png?s=1400'
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
          href: 'http://media.npr.org/images/podcasts/2013/primary/7am_et_' +
            'news_summary-72638a510ea23591a0e39f18db4188bc7fd58e24.png?s=1400'
        }
      }}
    ]
  });
  return rssFeed;
};

export let responseTime = function * responseTime(next) {
  let start = new Date();
  yield next;
  let ms = new Date() - start;
  this.set('X-Response-Time', ms + 'ms');
};

export let logger = function * logger(next) {
  let start = new Date();
  yield next;
  let ms = new Date() - start;
  console.log('%s', start);
};
