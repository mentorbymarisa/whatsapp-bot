const { getSession, setSession, deleteSession } = require('./sessions');
const { sendEnquiryEmail, sendConfirmationEmail } = require('./email');

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function handleMessage(from, body) {
  const text = (body || '').trim();
  const lower = text.toLowerCase();

  if (['restart', 'reset', 'start over'].includes(lower)) {
    deleteSession(from);
    return getWelcomeMessage();
  }
  if (['cancel', 'stop', 'quit'].includes(lower)) {
    deleteSession(from);
    return `No problem! Message us anytime you need help. 👋`;
  }

  let session = getSession(from);
  if (!session) {
    setSession(from, { step: 'name', data: {} });
    return getWelcomeMessage();
  }

  const { step, data } = session;

  if (step === 'name') {
    if (text.length < 2) return `Please enter your full name.`;
    setSession(from, { step: 'email', data: { ...data, name: text } });
    return `Nice to meet you, ${text}! 😊\n\nWhat is your *email address*?`;
  }

  if (step === 'email') {
    if (!isValidEmail(text)) return `That doesn't look like a valid email. Please try again.`;
    setSession(from, { step: 'phone', data: { ...data, email: text } });
    return `Got it! 📧\n\nWhat is your *phone number*? (Type "skip" to skip)`;
  }

  if (step === 'phone') {
    const phone = lower === 'skip' ? 'Not provided' : text;
    setSession(from, { step: 'question', data: { ...data, phone } });
    return `Almost done! 🙌\n\nWhat is your *dating question or challenge*?`;
  }

  if (step === 'question') {
    if (text.length < 5) return `Please describe your question in a bit more detail.`;
    const finalData = { ...data, question: text };
    setSession(from, { step: 'done', data: finalData });
    try {
      await sendEnquiryEmail(finalData, from);
      await sendConfirmationEmail(finalData);
    } catch (err) {
      console.error('Email error:', err.message);
    }
    return `✅ *Thank you ${finalData.name}!*\n\nI have received your question and will reply to ${finalData.email} within 24 hours.\n\nSpeak soon,\nMarisa 💫`;
  }

  if (step === 'done') {
    return `I have already received your enquiry! I will be in touch soon.\n\nWant to ask another question? Type *restart*.`;
  }

  return getWelcomeMessage();
}

function getWelcomeMessage() {
  return `👋 Hi! Welcome to *Marisa Tuchinsky Dating Mentor*.\n\nI am here to help you with your dating journey. Let me take a few details.\n\nFirst, what is your *full name*?\n\n_(Type *cancel* at any time to stop)_`;
}

module.exports = { handleMessage };
