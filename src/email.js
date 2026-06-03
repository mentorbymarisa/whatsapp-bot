const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEnquiryEmail(data, fromWhatsApp) {
  const { name, email, phone, question } = data;
  const msg = {
    to: process.env.OWNER_EMAIL,
    from: { email: process.env.FROM_EMAIL, name: 'WhatsApp Bot' },
    replyTo: email,
    subject: `New WhatsApp enquiry from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nWhatsApp: ${fromWhatsApp}\n\nQuestion:\n${question}`,
    html: `<h2>New WhatsApp Enquiry</h2>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>WhatsApp:</b> ${fromWhatsApp}</p>
      <p><b>Question:</b><br/>${question}</p>`
  };
  await sgMail.send(msg);
}

async function sendConfirmationEmail(data) {
  const { name, email } = data;
  const msg = {
    to: email,
    from: { email: process.env.FROM_EMAIL, name: 'Marisa Tuchinsky' },
    subject: `Thanks for your enquiry, ${name}!`,
    text: `Hi ${name},\n\nThank you for reaching out! I personally read every message and will reply within 24 hours.\n\nSpeak soon,\nMarisa Tuchinsky\nDating Mentor`
  };
  await sgMail.send(msg);
}

module.exports = { sendEnquiryEmail, sendConfirmationEmail };
