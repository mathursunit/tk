const express = require('express');
const Parser = require('rss-parser');
const cors = require('cors');

const app = express();
const parser = new Parser();

app.use(cors());
app.use(express.static('public'));

const feeds = {
  ndtv: 'https://feeds.feedburner.com/ndtvnews-top-stories',
  toi: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
  hindu: 'https://www.thehindu.com/feeder/default.rss',
  newslaundry: 'https://www.newslaundry.com/feed'
};

app.get('/api/:source', async (req, res) => {
  const url = feeds[req.params.source];
  if (!url) return res.status(404).json({ error: 'Unknown source' });

  try {
    const feed = await parser.parseURL(url);
    res.json(feed.items.slice(0, 5));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
