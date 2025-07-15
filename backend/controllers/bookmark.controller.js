const Bookmark = require('../models/Bookmark');
const axios = require('axios');
const cheerio = require('cheerio');
const JinaAI = require('jinaai');
const getSummary = require('../utils/getSummary');
const client = new JinaAI({
  method: 'fetch',
});

const fetchMetadata = async (url) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('title').text() ||
      'No title';

    const favicon =
      $('link[rel="icon"]').attr('href') ||
      '/favicon.ico';

    return { title, favicon };
  } catch (error) {
    return { title: 'No title', favicon: '/favicon.ico' };
  }
};

const summarize = async (url) => {
  try {
    const result = await client.summary(url);
    return result.summary || 'No summary available';
  } catch (error) {
    console.error('Jina AI error:', error.message);
    return 'No summary available';
  }
};
const saveBookmark = async (req, res) => {
  const { url, tags = [], folder } = req.body;

  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }

  try {
    // Fetch metadata
    const { title, favicon } = await fetchMetadata(url);

    // Fetch summary from Jina AI
    let summary = 'No summary available';
    try {
      summary = await getSummary(url);
    } catch (err) {
      console.warn('Summary fetch failed:', err.message);
    }

    // Create bookmark
    const bookmark = new Bookmark({
      user: req.user.id,
      url,
      title,
      favicon,
      summary,
      tags,
      folder: folder || null,
    });

    await bookmark.save();
    res.status(201).json(bookmark);
  } catch (error) {
    console.error('Bookmark save error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


const updateBookmark = async (req, res) => {
  const { id } = req.params;
  const { url, tags, folder } = req.body;

  try {
    const bookmark = await Bookmark.findOne({ _id: id, user: req.user.id });
    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    // If URL is changed, refetch metadata and summary
    if (url && url !== bookmark.url) {
      const { title, favicon } = await fetchMetadata(url);
      const summary = await getSummary(url);

      bookmark.url = url;
      bookmark.title = title;
      bookmark.favicon = favicon;
      bookmark.summary = summary;
    }

    if (tags) bookmark.tags = tags;
    if (folder !== undefined) bookmark.folder = folder || null;

    await bookmark.save();
    res.json(bookmark);
  } catch (error) {
    console.error('Update Bookmark Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBookmarks = async (req, res) => {
  const tag = req.query.tag;

  try {
    const query = { user: req.user.id };

    // ✅ Add tag filtering if query param provided
    if (tag) {
      query.tags = tag;
    }

    const bookmarks = await Bookmark.find(query).sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) return res.status(404).json({ message: 'Not found' });
    if (bookmark.user.toString() !== req.user.id)
      return res.status(401).json({ message: 'Unauthorized' });

    await bookmark.deleteOne();
    res.json({ message: 'Bookmark deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBookmarksByFolder = async (req, res) => {
  const { id: folderId } = req.params;

  try {
    const bookmarks = await Bookmark.find({
      user: req.user.id,
      folder: folderId,
    }).sort({ createdAt: -1 });

    res.json(bookmarks);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUnfolderedBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({
      user: req.user.id,
      folder: null, // specifically looking for bookmarks without a folder
    }).sort({ createdAt: -1 });

    res.json(bookmarks);
  } catch (error) {
    console.error('Unfoldered bookmarks error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  saveBookmark,
  getBookmarks,
  deleteBookmark,
  getBookmarksByFolder,
  updateBookmark,
  getUnfolderedBookmarks, 
};
