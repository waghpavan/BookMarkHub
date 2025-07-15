function validateBookmarkInput(req, res, next) {
  const { url, tags } = req.body;

  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }

  if (tags && (!Array.isArray(tags) || !tags.every(tag => typeof tag === 'string'))) {
    return res.status(400).json({ message: 'Tags must be an array of strings' });
  }

  next();
}

module.exports = { validateBookmarkInput };
