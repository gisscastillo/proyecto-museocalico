require('dotenv').config();

// Librerías principales
const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rutas para visitantes
app.use('/api/productos', require('./routes/productos'));

// login y registro
app.use('/api/auth', require('./routes/auth'));

// Manejo de errores
app.use((err, req, res, next) => {
    console.error("ERROR DETECTADO:", err.message);
    res.status(500).json({
        estado: 'Error',
        mensaje: 'Error interno en el servidor del museo',
        error: err.message
    });
});

// inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));