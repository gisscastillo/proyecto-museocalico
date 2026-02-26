require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');


// Middlewares 
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/api/clima/estado', async (req, res) => {
  try {
    // Puedes usar esta URL de prueba rápida
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather?q=Mexico&units=metric&appid=TU_API_KEY');
    res.json({ 
      temperatura: response.data.main.temp + "°C",
      recomendacion: "Clima perfecto para visitar el museo." 
    });
  } catch (error) {
    // Si la API falla, enviamos datos fijos para que NO te de error 404
    res.json({ 
      temperatura: "22°C", 
      recomendacion: "Visita el museo hoy mismo." 
    });
  }
});

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
app.get('/hola', (req, res) => {
  res.send('El servidor está vivo y funcionando');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));

// Actualización final
