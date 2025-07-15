const axios = require('axios');
const cheerio = require('cheerio');
const urlModule = require('url');

const getMetadata = async (url) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $('meta[property="og:title"]').attr('content') ||
                  $('title').text() ||
                  'No title';

    let favicon = $('link[rel="icon"]').attr('href') ||
                  $('link[rel="shortcut icon"]').attr('href') ||
                  '/favicon.ico';

    // Convert relative favicon URL to absolute
    if (favicon && !favicon.startsWith('http')) {
      const base = new urlModule.URL(url).origin;
      favicon = base + favicon;
    }

    return { title, favicon };
  } catch (err) {
    console.error('Metadata fetch error:', err.message);
    return { title: 'Unknown', favicon: '' };
  }
};

module.exports = { getMetadata };
