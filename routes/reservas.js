const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/crear', async (req, res) => {
    const { nombre, email, fecha, hora, personas } = req.body;
    try {
        await pool.query(
            'INSERT INTO reservas (nombre_usuario, email_usuario, fecha, hora, cantidad_personas) VALUES ($1, $2, $3, $4, $5)',
            [nombre, email, fecha, hora, personas]
        );
        res.status(201).json({ mensaje: "Reserva confirmada" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ mensaje: "Error al guardar en base de datos" });
    }
});
router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM reservas ORDER BY id DESC');
        res.json(resultado.rows); 
    } catch (err) {
        console.error("Error en DB:", err);
        res.status(500).json({ mensaje: "Error al obtener datos" });
    }
});
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await pool.query('DELETE FROM reservas WHERE id = $1', [id]);
        
        if (resultado.rowCount === 0) {
            return res.status(404).json({ mensaje: "No se encontró la reserva" });
        }

        res.json({ mensaje: "Reserva eliminada correctamente" });
    } catch (err) {
        console.error("Error al borrar:", err);
        res.status(500).json({ mensaje: "Error interno al eliminar" });
    }
});
module.exports = router;
