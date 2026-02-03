const express = require('express');
const router = express.Router();
const db = require('../db'); 
const auth = require('../middleware/authMiddleware'); 

// Leer reservaciones
router.get('/', auth, (req, res) => {
    db.query('SELECT * FROM productos', (err, results) => {
        if (err) return res.status(500).json({ estado: "Error", mensaje: "Error al leer reservaciones", error: err.message });
        res.json(results);
    });
});

// Craer reservación
router.post('/', auth, (req, res) => {
    const { nombre, descripcion, precio } = req.body;
    
    if (!nombre || !precio) {
        return res.status(400).json({ estado: "Error", mensaje: "Faltan campos obligatorios: nombre y cantidad (precio)" });
    }

    const query = 'INSERT INTO productos (nombre, descripcion, precio) VALUES (?, ?, ?)';
    db.query(query, [nombre, descripcion, precio], (err, result) => {
        if (err) return res.status(500).json({ estado: "Error", error: err.message });
        res.status(201).json({ mensaje: 'Reservación creada con éxito', id: result.insertId });
    });
});

// Actualizar
router.put('/:id', auth, (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio } = req.body;

    const query = 'UPDATE productos SET nombre = ?, descripcion = ?, precio = ? WHERE id = ?';
    db.query(query, [nombre, descripcion, precio, id], (err, result) => {
        if (err) return res.status(500).json({ estado: "Error", error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Registro no encontrado" });
        res.json({ mensaje: 'Registro actualizado correctamente' });
    });
});

// Eliminar
router.delete('/:id', auth, (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM productos WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ estado: "Error", error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Registro no encontrado" });
        res.json({ mensaje: 'Registro eliminado del sistema' });
    });
});

module.exports = router;