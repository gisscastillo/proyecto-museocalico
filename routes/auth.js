const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../db');
const bcrypt = require('bcryptjs');

// Registro
router.post('/register', async (req, res) => {
    const { nombre, email, password } = req.body;
    try {
        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const query = 'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING *';
        const result = await pool.query(query, [nombre, email, hashedPassword]);

        if (result.rows.length > 0) {
            res.status(201).json({ mensaje: "Usuario registrado con éxito" });
        } else {
            res.status(400).json({ mensaje: "No se pudo guardar el usuario" });
        }
    } catch (error) {
        console.error("ERROR REGISTRO:", error.message);
        res.status(500).json({ mensaje: "Error al registrar: " + error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar usuario 
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email.trim()]);
        
        if (result.rows.length === 0) {
            return res.status(400).json({ mensaje: "Usuario no encontrado" });
        }

        const usuario = result.rows[0];
        
        // Comparar contraseña
        const validPass = await bcrypt.compare(password, usuario.password);
        if (!validPass) {
            return res.status(400).json({ mensaje: "Contraseña incorrecta" });
        }

        // Generar Token
        const token = jwt.sign(
            { id: usuario.id }, 
            process.env.JWT_SECRET || 'museocalico', 
            { expiresIn: '2h' }
        );

        res.json({ 
            mensaje: "Login exitoso", 
            token: token,
            usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
        });

    } catch (error) {
        console.error("ERROR LOGIN:", error.message);
        res.status(500).json({ mensaje: "Error en el servidor: " + error.message });
    }
});

module.exports = router;
