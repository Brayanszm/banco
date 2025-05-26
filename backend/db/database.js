const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta de la base de datos (puedes cambiar el nombre si deseas)
const dbPath = path.resolve(__dirname, 'users.db');

// Crear conexión con la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite');
  }
});

// Crear tablas si no existen
db.serialize(() => {
  // Tabla de usuarios
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error al crear la tabla de usuarios:', err.message);
    } else {
      console.log('Tabla de usuarios lista');
    }
  });

  // Tabla de cajeros automáticos
  db.run(`
    CREATE TABLE IF NOT EXISTS atms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      direccion TEXT NOT NULL,
      banco TEXT NOT NULL,
      estado TEXT NOT NULL CHECK(estado IN ('Disponible', 'En mantenimiento', 'Fuera de servicio')),
      cantidad_dinero REAL NOT NULL,
      ultima_actualizacion TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error al crear la tabla de cajeros:', err.message);
    } else {
      console.log('Tabla de cajeros lista');
    }
  });
});

module.exports = db;
