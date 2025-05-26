const express = require('express');
const router = express.Router();
const db = require('../db/database');
const enviarCorreo = require('../mailer');
const authenticateToken = require('../middleware/verifyToken'); // Si usas autenticación

// Obtener todos los cajeros
router.get('/', (req, res) => {
  db.all('SELECT * FROM atms', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener cajeros' });
    res.json(rows);
  });
});

// Actualizar estado del cajero y enviar correos
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  const nuevaFecha = new Date().toISOString();

  db.run(
    `UPDATE atms SET estado = ?, ultima_actualizacion = ? WHERE id = ?`,
    [estado, nuevaFecha, id],
    function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'Error al actualizar el cajero' });
      }

      const io = req.app.get('io');
      io.emit('estadoActualizado', { id: parseInt(id), nuevoEstado: estado });

      console.log('Estado actualizado, iniciando notificaciones...');

      db.all(`SELECT name, email FROM users`, [], (err, usuarios) => {
        if (err) {
          console.error('Error al obtener usuarios:', err);
          return;
        }

        usuarios.forEach(usuario => {
          const asunto = `Cambio de estado en cajero: ${id}`;
          const mensaje = `Hola ${usuario.name},\n\nEl estado del cajero con ID ${id} ha cambiado a: ${estado}.\n\nGracias,\nSistema de Monitoreo de Cajeros.`;

          console.log(`Enviando correo a ${usuario.email}...`);

          enviarCorreo(usuario.email, asunto, mensaje)
            .then(info => {
              console.log(`Correo enviado a ${usuario.email}:`, info.response);
            })
            .catch(err => {
              console.error(`Error al enviar correo a ${usuario.email}:`, err);
            });
        });
      });

      res.json({ message: 'Estado actualizado correctamente' });
    }
  );
});

module.exports = router;
