const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.static(path.join(__dirname, 'frontend')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

const PUERTO = parseInt(process.env.PUERTO_FRONTEND) || 8080;
app.listen(PUERTO, () => {
  console.log(`[Frontend] servido en http://localhost:${PUERTO}`);
});
