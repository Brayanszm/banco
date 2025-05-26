const db = require('./db/database');

const estados = ['Disponible', 'En mantenimiento', 'Fuera de servicio'];

const cajerosBancolombia = [
  { nombre: 'CENTRO INTERNACIONAL', direccion: 'CARRERA 7 N° 30A - 28' },
  { nombre: 'ANTIGUO COUNTRY', direccion: 'CARRERA 16A N° 84 - 93' },
  { nombre: 'POLO CLUB', direccion: 'CARRERA 24 N° 80 - 56' },
  { nombre: 'BARRIO 7 DE AGOSTO', direccion: 'CARRERA 24 N° 63F - 36' },
  { nombre: 'CALLE ONCE', direccion: 'CALLE 11 N° 11 - 20' },
  { nombre: 'ECOPETROL', direccion: 'CARRERA 13 N° 35 - 39' },
  { nombre: 'CENTRO 93', direccion: 'CARRERA 15 N° 93 - 60 local 103' },
  { nombre: 'PLAZA ESPAÑA', direccion: 'CARRERA 17 N° 11 - 13' },
  { nombre: 'PUENTE LARGO', direccion: 'AVENIDA SUBA N° 105 - 08' },
  { nombre: 'PUENTE ARANDA', direccion: 'CALLE 13 N° 42 - 17' },
  { nombre: 'CIUDAD KENNEDY', direccion: 'CALLE 35 A sur N° 75 B – 06' },
  { nombre: 'LAS GRANJAS', direccion: 'CALLE 17 N° 65 B-95' },
  { nombre: 'AVENIDA CHILE', direccion: 'CALLE 72 N° 8 - 20' },
  { nombre: 'LAS FERIAS', direccion: 'AVENIDA CALLE 72 N° 69P - 15' },
  { nombre: 'CALLE 140', direccion: 'Cra. 12B No. 140-10' },
  { nombre: 'CARRERA DECIMA', direccion: 'CARRERA 10 N° 17 - 54' },
  { nombre: 'CALLE 122', direccion: 'CALLE 122 N° 18 - 61' },
  { nombre: 'CENTRO DE PAGOS SUBAZAR', direccion: 'CARRERA 92 No. 145-42 LOCAL 127/30' },
  { nombre: 'CENTRO DE PAGOS CALLE 72', direccion: 'CALLE 72 N° 8 - 56' },
  { nombre: 'CALLE 80', direccion: 'Cra. 59 A # 79 – 30' },
  { nombre: 'BULEVAR', direccion: 'Carrera 58 No. 127-59 locales 108-109' },
  { nombre: 'ALTAVISTA USME', direccion: 'Diagonal 65 d sur N. 1-07 este bogota' },
  { nombre: 'BOSA', direccion: 'CALLE 65 SUR N° 78 L - 53' },
  { nombre: 'MULTIPLAZA DRIVE', direccion: 'CALLE 153 N° 59-15 LOCALES 1–01,02, 03, 04, 35, 36, 37 y 38' },
  { nombre: 'CALLE PRIMERA', direccion: 'CALLE 1 N° 17A-44 BOGOTA' },
  { nombre: 'PLAZA DE LAS AMERICAS', direccion: 'TRANSV.71 D 26- 94 SUR LOCAL 1002' },
  { nombre: 'LAS AGUAS', direccion: 'CARRERA 3 NO. 20-58' },
  { nombre: 'ÉXITO COLINA CAMPESTRE', direccion: 'Carrera 72 # 146 A - 25' },
  { nombre: 'OF.SER.EMP BOGOTA', direccion: 'Carrera 7 N 31-10' },
  { nombre: 'AVENIDA SEXTA BOGOTA', direccion: 'AVENIDA CALLE SEXTA N° 20 -42' },
];

// Agregar información adicional
cajerosBancolombia.forEach((atm) => {
  atm.banco = 'Bancolombia';
  atm.estado = estados[Math.floor(Math.random() * estados.length)];
  atm.cantidad_dinero = Math.floor(Math.random() * 15000000); // hasta 15 millones
  atm.ultima_actualizacion = new Date().toISOString();
});

// Insertar en la base de datos
cajerosBancolombia.forEach((atm) => {
  db.run(
    `INSERT INTO atms (nombre, direccion, banco, estado, cantidad_dinero, ultima_actualizacion)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      atm.nombre,
      atm.direccion,
      atm.banco,
      atm.estado,
      atm.cantidad_dinero,
      atm.ultima_actualizacion
    ],
    (err) => {
      if (err) {
        console.error('Error al insertar cajero:', err.message);
      } else {
        console.log(`Cajero insertado: ${atm.nombre}`);
      }
    }
  );
});
