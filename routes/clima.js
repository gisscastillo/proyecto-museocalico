const express = require('express');
const router = express.Router();
const axios = require('axios');

// Ruta que YA usa tu frontend
router.get('/info', async (req, res) => {
    const frases = [
        "El arte es la mentira que nos permite comprender la verdad.",
        "Cada cuadro es un viaje a un mundo desconocido.",
        "El museo es el lugar donde el tiempo se detiene.",
        "La belleza salvará al mundo."
    ];

    const fraseAzar = frases[Math.floor(Math.random() * frases.length)];

    try {
        const ciudad = "Ciudad de Mexico";
        const apiKey = "8016eec825cf546003aca50d32d90c67"; 

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`;

        const respuesta = await axios.get(url);

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
            frase: fraseAzar,
            temperatura: `${temp}°C`,
            recomendacion: sugerencia
        });

    } catch (err) {
        console.error("Error al conectar con API de Clima:", err.message);

        res.json({
            frase: fraseAzar,
            temperatura: "22°C",
            recomendacion: "Visita el museo hoy mismo."
        });
    }
});

module.exports = router;