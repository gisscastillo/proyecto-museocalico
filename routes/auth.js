const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../db');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
    const { nombre, email, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Guardar en la base de datos
        const result = await pool.query(
            'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING *',
            [nombre, email, hashedPassword]
        );

        const nuevoUsuario = result.rows[0];

        const token = jwt.sign(
            { id: nuevoUsuario.id }, 
            process.env.JWT_SECRET || 'museocalico', 
            { expiresIn: '2h' }
        );

        res.status(201).json({ mensaje: "Registro exitoso", token, usuario: nuevoUsuario });
    } catch (error) {
        console.error("ERROR REAL:", error.message);
        res.status(500).json({ mensaje: "Error al guardar: " + error.message });
    }
});

module.exports = router;
