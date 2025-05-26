const express = require('express');
const router = express.Router();
const db = require('../db/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrar usuario
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, existingUser) => {
    if (err) {
      console.error('❌ Error en base de datos (registro):', err.message);
      return res.status(500).json({ error: 'Error en base de datos' });
    }

    if (existingUser) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'user'],
      function (err) {
        if (err) {
          console.error('❌ Error al registrar usuario:', err.message);
          return res.status(500).json({ error: 'Error al registrar el usuario' });
        }

        console.log('✅ Usuario registrado:', email);
        res.status(201).json({ message: 'Usuario registrado correctamente' });
      }
    );
  });
});

// Iniciar sesión
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  console.log('➡️ Intentando iniciar sesión:', email);

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      console.error('❌ Error en base de datos (login):', err.message);
      return res.status(500).json({ error: 'Error en base de datos' });
    }

    if (!user) {
      console.warn('⚠️ Usuario no encontrado:', email);
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.warn('⚠️ Contraseña incorrecta para:', email);
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    console.log('✅ Usuario autenticado:', email);

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
  token,
  user: {
    name: user.name,
    email: user.email,
    role: user.role,
    id: user.id
  }
});

  });
});

// Restablecer contraseña
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    db.run('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email], function (err) {
      if (err) {
        console.error('❌ Error al actualizar la contraseña:', err.message);
        return res.status(500).json({ error: 'Error en base de datos al actualizar la contraseña' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      console.log('✅ Contraseña actualizada para:', email);
      return res.status(200).json({ message: 'Contraseña actualizada correctamente' });
    });
  } catch (error) {
    console.error('❌ Error en el servidor:', error.message);
    return res.status(500).json({ error: 'Error en el servidor al actualizar la contraseña' });
  }
});

module.exports = router;
