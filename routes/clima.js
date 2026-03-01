const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/info', async (req, res) => {
    const frases = [
        "El arte es la mentira que nos permite comprender la verdad.",
        "Cada cuadro es un viaje a un mundo desconocido.",
        "El museo es el lugar donde el tiempo se detiene.",
        "La belleza salvará al mundo."
    ];

    const fraseAzar = frases[Math.floor(Math.random() * frases.length)];

    try {
        const ciudad = "Mexico City";
        const apiKey = process.env.OPENWEATHER_KEY || "demo";

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`;

        const respuesta = await axios.get(url);

        const temp = respuesta.data.main.temp;

        let sugerencia = "";
        if (temp > 25) {
            sugerencia = "Día caluroso. Recomendamos visitar nuestras salas con aire acondicionado.";
        } else if (temp < 15) {
            sugerencia = "Día fresco. Ideal para disfrutar de un café caliente.";
        } else {
            sugerencia = "Clima perfecto para visitar el museo.";
        }

        res.json({
            frase: fraseAzar,
            temperatura: `${temp}°C`,
            recomendacion: sugerencia
        });

    } catch (err) {
        console.error("ERROR OPENWEATHER:", err.response?.data || err.message);

        res.json({
            frase: fraseAzar,
            temperatura: "22°C",
            recomendacion: "Disfruta de nuestras salas climatizadas."
        });
    }
});

module.exports = router;