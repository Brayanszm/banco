const db = require('./db/database');
const bcrypt = require('bcryptjs');

(async () => {
  const email = 'yeremi@cashtrack.com';
  const password = 'yeremi';
  const hashed = await bcrypt.hash(password, 10);

  db.run(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    ['Admin', email, hashed, 'admin'],
    (err) => {
      if (err) {
        console.error('Admin ya existe o hubo error:', err.message);
      } else {
        console.log('Admin creado con éxito');
      }
    }
  );
})();
