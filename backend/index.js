const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors'); // ✅ Import CORS
const folderRoutes = require('./routes/folder.routes');

dotenv.config();
connectDB();

const app = express();

// ✅ Enable CORS for frontend
const corsOptions = {
  origin: ['http://localhost:3000', 'https://bookmarkhub-g5os.onrender.com'], // frontend origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // allowed methods
  credentials: true, // allow cookies/auth headers
};

app.use(cors(corsOptions));

// ✅ Middleware to parse JSON body
app.use(express.json());

// ✅ API Routes
app.use('/api/bff/auth', require('./routes/auth.routes'));
app.use('/api/bff/bookmarks', require('./routes/bookmark.routes'));
app.use('/api/bff/folders', folderRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
