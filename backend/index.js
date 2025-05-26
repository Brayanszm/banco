const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const atmRoutes = require('./routes/atm');
const adminRoutes = require('./routes/admin');

dotenv.config();

const app = express();
const server = http.createServer(app); // Servidor HTTP para usar con Socket.IO

const io = new Server(server, {
  cors: {
    origin: '*', // Permite acceso desde cualquier frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware para poder leer JSON en las peticiones
app.use(express.json());
app.use(cors());

// Inyectar io en la app para que pueda usarse en otras partes
app.set('io', io);

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/atms', atmRoutes);
app.use('/api/admin', adminRoutes);

// Socket.IO eventos (puedes personalizar esto si lo necesitas)
io.on('connection', (socket) => {
  console.log('Cliente conectado vía WebSocket');

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Arrancar el servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

