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
        const sql = 'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3)';
        pool.query(sql, [nombre, email, hashedPassword], (err) => {
            if (err) return res.status(500).json({ mensaje: "Error en base de datos" });
            res.status(201).json({ mensaje: "Usuario registrado" });
        });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    pool.query('SELECT * FROM usuarios WHERE email = $1', [email], async (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.rows.length === 0) return res.status(400).json({ mensaje: "Usuario no encontrado" });
        const usuario = result.rows[0];
        const validPass = await bcrypt.compare(password, usuario.password);
        if (!validPass) return res.status(400).json({ mensaje: "Contraseña incorrecta" });
        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET || 'clave', { expiresIn: '2h' });
        res.json({ mensaje: "Login exitoso", token });
    });
});
module.exports = router;
