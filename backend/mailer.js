const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function enviarCorreo(destinatario, asunto, mensaje) {
  const mailOptions = {
    from: `"Sistema Cajeros" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: asunto,
    text: mensaje,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = enviarCorreo;
