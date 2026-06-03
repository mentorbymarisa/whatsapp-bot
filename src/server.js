require('dotenv').config();
const express = require('express');
const webhookRouter = require('./webhook');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'Marisa Tuchinsky Dating Mentor — WhatsApp Bot running ✅' }));
app.post('/webhook', webhookRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
