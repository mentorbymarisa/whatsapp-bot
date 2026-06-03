const express = require('express');
const twilio = require('twilio');
const { handleMessage } = require('./conversation');

const router = express.Router();

router.post('/', async (req, res) => {
  const from = req.body.From;
  const body = req.body.Body;
  console.log(`📩 Message from ${from}: ${body}`);
  try {
    const reply = await handleMessage(from, body);
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(reply);
    res.type('text/xml').send(twiml.toString());
  } catch (err) {
    console.error('Webhook error:', err);
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message('Sorry, something went wrong. Please try again shortly.');
    res.type('text/xml').send(twiml.toString());
  }
});

module.exports = router;
