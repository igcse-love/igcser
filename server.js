
const express = require('express');
const path = require('path');
const app = express();

// Set the port from Render or default to 3000
const PORT = process.env.PORT || 3000;

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// API example route (you can add more like this)
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

// Serve index.html on all unhandled routes (for single page apps)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
