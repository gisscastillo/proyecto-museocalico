require('dotenv').config(); 
console.log("JWT_SECRET:", process.env.JWT_SECRET);
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Middlewares 
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rutas de otros módulos
app.use('/api/productos', require('./routes/productos'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/reservas', require('./routes/reservas'));
app.use('/api/museo', require('./routes/clima'));

// Rutas de diagnóstico
app.get('/health', (req, res) => res.send('Servidor del museo funcionando'));
app.get('/hola', (req, res) => res.send('El servidor está vivo y funcionando'));

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error("=== ERROR EN EL SERVIDOR ===");
    console.error(err.stack);
    res.status(500).json({
        mensaje: "Hubo un problema interno en el servidor",
        error: err.message 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));