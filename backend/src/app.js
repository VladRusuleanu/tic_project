const express = require('express');
const cors = require('cors');
const logger = require('./config/logger');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/api/products', productRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

module.exports = app;
