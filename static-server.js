const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.static(path.join(__dirname, 'frontend'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.php')) res.setHeader('Content-Type', 'text/html; charset=utf-8');
  }
}));

app.get('*', (req, res) => {
  res.type('html').sendFile(path.join(__dirname, 'frontend/index.php'));
});

const PORT = process.env.PORT || process.env.PUERTO_FRONTEND || 8080;

app.listen(PORT, () => {
  console.log(`Frontend servido en puerto ${PORT}`);
});