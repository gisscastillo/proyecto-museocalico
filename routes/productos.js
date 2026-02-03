const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', (req, res) => {
    pool.query('SELECT * FROM productos', (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result.rows);
    });
});

router.post('/', (req, res) => {
    const { nombre, descripcion, precio } = req.body;
    const sql = 'INSERT INTO productos (nombre, descripcion, precio) VALUES ($1, $2, $3)';
    pool.query(sql, [nombre, descripcion, precio], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ mensaje: "Producto creado" });
    });
});
module.exports = router;
