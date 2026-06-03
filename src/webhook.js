const express = require('express');
const { handleMessage } = require('./conversation');

const router = express.Router();

router.post('/', async (req, res) => {
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

module.exports = router;
