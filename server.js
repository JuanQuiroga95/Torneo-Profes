const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable JSON body parser with large limits for base64 files
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Mock Vercel serverless functions inside Express
app.get('/api/get-data', require('./api/get-data'));
app.post('/api/save-data', require('./api/save-data'));
app.post('/api/upload-media', require('./api/upload-media'));
app.get('/api/media', require('./api/media'));

// Serve the static index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve any other static files if needed
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`🚀 Local dev server running at: http://localhost:${PORT}`);
});
