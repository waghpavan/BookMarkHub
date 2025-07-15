const Folder = require('../models/Folder');

// ✅ Create a new folder
const createFolder = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Folder name is required' });
  }

  try {
    const folder = new Folder({
      name,
      user: req.user.id,
    });

    await folder.save();
    res.status(201).json(folder);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get all folders for the current user
const getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(folders);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createFolder,
  getFolders,
};
