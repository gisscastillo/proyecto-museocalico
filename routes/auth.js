const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');
const bcrypt = require('bcryptjs');

// Registro
router.post('/register', async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Verifica que los nombres de las columnas coincidan 
        const sql = 'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)';
        
        db.query(sql, [nombre, email, hashedPassword], (err, result) => {
            if (err) {
                console.error("DETALLE ERROR MYSQL:", err); 
                return res.status(500).json({ mensaje: "Error al guardar en base de datos" });
            }
            res.status(201).json({ mensaje: "Usuario registrado con éxito" });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(400).json({ mensaje: "Usuario no encontrado" });

        const usuario = results[0];
        const validPass = await bcrypt.compare(password, usuario.password);
        
        if (!validPass) return res.status(400).json({ mensaje: "Contraseña incorrecta" });

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '2h' });

        res.json({ mensaje: "Login exitoso", token: token });
    });
});

module.exports = router;