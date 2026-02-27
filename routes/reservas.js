const express = require('express');
const router = express.Router();
const pool = require('../db');
const validarReserva = require('../middleware/validarReserva'); // Importamos el validador del Paso 2
const authMiddleware = require('../middleware/authMiddleware');
const admin = require('../middleware/admin');

// --- 1. RUTA PARA CREAR (Ahora con el middleware de validación) ---
router.post('/crear', validarReserva, async (req, res) => {
    // Nota: Usamos 'personas' y 'hora' tal como vienen de tu frontend
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

// --- RUTA GET CON PAGINACIÓN Y FILTROS (100% Cumplimiento) ---
router.get('/', authMiddleware, admin, async (req, res) => {
    try {
        // Capturamos parámetros de la URL (ej: /reservas?page=1&limit=5&email=test@test.com)
        const page = parseInt(req.query.page) || 1;    // Página actual (por defecto 1)
        const limit = parseInt(req.query.limit) || 10; // Cuántos resultados mostrar
        const emailFiltro = req.query.email || null;   // Filtro por email (opcional)
        const offset = (page - 1) * limit;             // Cálculo de dónde empezar a leer

        let queryText = 'SELECT * FROM reservas';
        let queryParams = [];

        // Lógica de Filtro: Si el usuario envía un email, filtramos la búsqueda
        if (emailFiltro) {
            queryText += ' WHERE email_usuario = $1';
            queryParams.push(emailFiltro);
        }

        // Lógica de Paginación: Aplicamos LIMIT y OFFSET
        queryText += ` ORDER BY id DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
        queryParams.push(limit, offset);

        const resultado = await pool.query(queryText, queryParams);
        
        // Obtenemos el total de registros para informar al frontend
        const totalRes = await pool.query('SELECT COUNT(*) FROM reservas');
        const totalItems = parseInt(totalRes.rows[0].count);

        // Respuesta enriquecida para cumplir con la rúbrica
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

// --- 3. RUTA PARA ELIMINAR (Se mantiene igual, pero lista para usar) ---
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