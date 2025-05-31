// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT =  8080;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Fallback: Serve index.html for any unknown routes (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend running on port ${PORT}`);
});
