const express = require('express');
const userRoutes = require('./routes');
const app = express();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);

const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Use this after the variable declaration
app.use(express.json()); // Middleware para parsear JSON en el cuerpo de las solicitudes

// Utilizar las rutas definidas en 'routes/index.js'
// '/api' es el prefijo de ruta para todas las rutas definidas en userRoutes
app.use('/api', userRoutes);

// Definir el puerto y poner el servidor a escuchar
const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});