require('dotenv').config();
const express = require('express');
const { handleMessage } = require('./conversation');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'Marisa Tuchinsky Dating Mentor — WhatsApp Bot running ✅' }));

app.post('/webhook', async (req, res) => {
  console.log('📩 Incoming webhook hit');
  console.log('Body:', JSON.stringify(req.body));
  const from = req.body.From;
  const body = req.body.Body;
  try {
    const reply = await handleMessage(from, body);
    console.log('📤 Replying:', reply);
    res.set('Content-Type', 'text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${reply}</Message></Response>`);
  } catch (err) {
    console.error('Webhook error:', err);
    res.set('Content-Type', 'text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>Sorry, something went wrong. Please try again.</Message></Response>`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
