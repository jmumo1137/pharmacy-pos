require('dotenv').config();
const express = require('express');
const cors = require('cors');

const routes = require('./src/routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.json({ ok: true, message: 'Pharmacy POS API' }));

app.use('/api', routes);

module.exports = app;
