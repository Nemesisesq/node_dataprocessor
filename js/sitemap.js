var remoteSitemapGenerator = require('remote-sitemap-generator');
remoteSitemapGenerator('http://www.streamsavvy.tv', {fields: {priority: 1.0, changefreq: 'daily'}});