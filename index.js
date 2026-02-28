require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Middlewares 
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// clima y frase
app.get('/api/museo/info', async (req, res) => {
  const frases = [
    "El arte es la mentira que nos permite comprender la verdad.",
    "Cada cuadro es un viaje a un mundo desconocido.",
    "El museo es el lugar donde el tiempo se detiene.",
    "La belleza salvará al mundo."
  ];
  const fraseAzar = frases[Math.floor(Math.random() * frases.length)];

  try {
    //clima real con API
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather?q=Mexico&units=metric&appid=TU_API_KEY');
    res.json({ 
      frase: fraseAzar,
      temperatura: response.data.main.temp + "°C",
      recomendacion: "Clima perfecto para visitar el museo." 
    });
  } catch (error) {
    res.json({ 
      frase: fraseAzar,
      temperatura: "22°C", 
      recomendacion: "Visita el museo hoy mismo." 
    });
  }
});

// Rutas de otros módulos
app.use('/api/productos', require('./routes/productos'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/reservas', require('./routes/reservas'));

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