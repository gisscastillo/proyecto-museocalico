const express = require('express');
const app = express();

app.get('/api/museo/info', (req, res) => {
    res.json({ 
        frase: "Prueba de despliegue exitosa",
        clima: "22°C",
        estado: "Funcionando" 
    });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('Servidor en puerto ' + PORT));