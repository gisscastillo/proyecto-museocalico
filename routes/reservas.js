const express = require('express');
const router = express.Router();
const pool = require('../db');
const validarReserva = require('../middleware/validarReserva'); 
const authMiddleware = require('../middleware/authMiddleware');
const admin = require('../middleware/admin');

// ruta crear reserva (pública, sin auth)
router.post('/', validarReserva, async (req, res) => {
    const { nombre, email, fecha, hora, personas } = req.body;
    try {
        await pool.query(
            'INSERT INTO reservas (nombre_usuario, email_usuario, fecha, hora, cantidad_personas) VALUES ($1, $2, $3, $4, $5)',
            [nombre, email, fecha, hora, parseInt(personas)]
        );
        res.status(201).json({ mensaje: "Reserva confirmada" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ mensaje: "Error al guardar en base de datos" });
    }
});

router.get('/', authMiddleware, admin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;    
        const limit = parseInt(req.query.limit) || 10; 
        const emailFiltro = req.query.email || null;   
        const offset = (page - 1) * limit;             

        let queryText = 'SELECT * FROM reservas';
        let queryParams = [];

        if (emailFiltro) {
            queryText += ' WHERE email_usuario = $1';
            queryParams.push(emailFiltro);
        }

        queryText += ` ORDER BY id DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
        queryParams.push(limit, offset);

        const resultado = await pool.query(queryText, queryParams);
        
        // total de registros 
        const totalRes = await pool.query('SELECT COUNT(*) FROM reservas');
        const totalItems = parseInt(totalRes.rows[0].count);

        res.json({
            datos: resultado.rows,
            paginacion: {
                totalItems,
                paginaActual: page,
                totalPaginas: Math.ceil(totalItems / limit)
            }
        });
    } catch (err) {
        console.error("[DEBUGGING ERROR]:", err);
        res.status(500).json({ mensaje: "Error al obtener datos con paginación" });
    }
});

// ruta eliminar reserva (solo admin)
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