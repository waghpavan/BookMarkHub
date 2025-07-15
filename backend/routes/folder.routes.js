const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createFolder, getFolders } = require('../controllers/folder.controller');

// 🔐 Protected routes
router.post('/', authMiddleware, createFolder);   // POST /api/folders
router.get('/', authMiddleware, getFolders);      // GET /api/folders

module.exports = router;
