const express = require('express');
const router = express.Router();
const {
  saveBookmark,
  getBookmarks,
  deleteBookmark,
  getBookmarksByFolder,
  updateBookmark, 
  getUnfolderedBookmarks,
} = require('../controllers/bookmark.controller');

const authMiddleware = require('../middleware/authMiddleware');
const { validateBookmarkInput } = require('../middleware/validateInput');

// @route   POST /api/bookmarks
router.post('/', authMiddleware, saveBookmark);

// @route   GET /api/bookmarks
router.get('/', authMiddleware, getBookmarks);

// @route   DELETE /api/bookmarks/:id
router.delete('/:id', authMiddleware, deleteBookmark);

router.get('/folder/:id', authMiddleware, getBookmarksByFolder);

router.patch('/:id', authMiddleware, updateBookmark);


// @route   Tag /api/bookmarks/:id
router.post('/', authMiddleware, validateBookmarkInput, saveBookmark);

router.get('/folderless/all', authMiddleware, getUnfolderedBookmarks);

module.exports = router;
