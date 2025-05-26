// routes/admin.js
const express = require('express');
const router = express.Router();
const db = require('../db/database');
const verifyToken = require('../middleware/verifyToken');

// Obtener todos los cajeros (solo admin)
router.put('/cajeros', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  db.all('SELECT * FROM cajeros', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error en base de datos' });
    }
    res.json(rows);
  });
});

// Actualizar estado de cajero
router.put('/cajeros/:id', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  const { id } = req.params;
  const { estado } = req.body;

  db.run('UPDATE cajeros SET estado = ?, ultima_actualizacion = CURRENT_TIMESTAMP WHERE id = ?', [estado, id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar cajero' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Cajero no encontrado' });
    }

    res.json({ message: 'Estado actualizado correctamente' });
  });
});

module.exports = router;
