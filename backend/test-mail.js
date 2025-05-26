const enviarCorreo = require('./mailer');

enviarCorreo(
  'cristianguarin1234@gmail.com', // pon tu correo
  'Prueba de sistema',
  'Este es un correo de prueba desde el sistema de cajeros.'
).then(() => {
  console.log('Correo enviado correctamente');
}).catch(err => {
  console.error('Error al enviar correo:', err.message);
});
