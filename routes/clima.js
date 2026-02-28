const express = require('express');
const router = express.Router();
const axios = require('axios');

// Ruta para obtener el clima del museo
router.get('/estado', async (req, res) => {
    try {
        const ciudad = "Ciudad de Mexico"; 
        const apiKey = "9b5c6b67e20d605d559fdc6fd9851f4d";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`;

        const respuesta = await axios.get(url);
        
        // Datos reales de la API
        const temp = respuesta.data.main.temp;
        const climaDesc = respuesta.data.weather[0].description;

        let sugerencia = "";
        if (temp > 25) {
            sugerencia = "Día caluroso. Recomendamos visitar nuestras salas con aire acondicionado y la fuente principal.";
        } else if (temp < 15) {
            sugerencia = "Día fresco. Ideal para disfrutar de un café caliente en la galería de arte moderno.";
        } else {
            sugerencia = "Clima perfecto. No olvides visitar el jardín de esculturas al aire libre.";
        }

        res.json({
            ubicacion: ciudad,
            temperatura: `${temp}°C`,
            condicion: climaDesc,
            recomendacion_museo: sugerencia,
            fuente: "OpenWeatherMap API"
        });

    } catch (err) {
        console.error("Error al conectar con API de Clima:", err.message);
        res.status(500).json({ 
            mensaje: "No se pudo obtener la información del clima",
            error: err.message 
        });
    }
});

module.exports = router;