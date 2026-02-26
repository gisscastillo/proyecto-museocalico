require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');

// Middlewares 
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/health', (req, res) => res.send('Servidor del museo funcionando'));

// Rutas 
app.use('/api/productos', require('./routes/productos'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/reservas', require('./routes/reservas'));
app.use('/api/clima', require('./routes/clima'));

// Manejo de errores 
app.use((err, req, res, next) => {
    console.error("ERROR EN EL SERVIDOR:", err);
    res.status(500).json({
        estado: 'Error',
        mensaje: 'Error interno en el servidor del museo',
        detalles: err.message
    });
});
// Este es el middleware personalizado para gestión de errores
app.use((err, req, res, next) => {
    // Debugging: Imprime el error en la consola de Node.js para que puedas verlo
    console.error("=== DEBUGGING ERROR ===");
    console.error(err.stack); 

    // Enviamos una respuesta limpia al cliente
    res.status(500).json({
        mensaje: "Hubo un problema interno en el servidor",
        error: err.message 
    });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));

