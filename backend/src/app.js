const express = require('express');
const cors = require('cors');
const logger = require('./config/logger');
const productsRoutes = require("./routes/products");

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);
app.use("/products", productsRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV
  });
});

module.exports = app;
