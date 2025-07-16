const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const folderRoutes = require('./routes/folder.routes');

dotenv.config();
connectDB();

const app = express();

// ✅ MIDDLEWARE to parse JSON body (required for POST /login and /register)
app.use(express.json());

app.use('/api/bff/auth', require('./routes/auth.routes'));
app.use('/api/bff/bookmarks', require('./routes/bookmark.routes'));
app.use('/api/bff/folders', folderRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
