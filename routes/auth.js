const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro de usuario
router.post('/register', async (req, res) => {
    const { nombre, email, password } = req.body;

    // Validación 
    if (!nombre || !email || !password) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    // Asignación automática de rol
    const correoAdmin = "admin@museocalico.com";
    const rolAsignado = (email === correoAdmin) ? 'admin' : 'usuario';

    try {
        const hash = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4)',
            [nombre, email, hash, rolAsignado]
        );

        res.status(201).json({
            mensaje: "Usuario creado correctamente",
            rol: rolAsignado
        });

    } catch (err) {
        console.error("Error en register:", err.message);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validación 
    if (!email || !password) {
        return res.status(400).json({ mensaje: "Email y contraseña son requeridos" });
    }

    try {
        const user = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1',
            [email]
        );

        // Usuario no encontrado
        if (user.rows.length === 0) {
            return res.status(401).json({ mensaje: "Datos incorrectos" });
        }

        // Verificar contraseña
        const passwordValido = await bcrypt.compare(
            password,
            user.rows[0].password
        );

        if (!passwordValido) {
            return res.status(401).json({ mensaje: "Datos incorrectos" });
        }

        // Verificar JWT_SECRET
        if (!process.env.JWT_SECRET) {
            console.error("❌ JWT_SECRET no está configurado");
            return res.status(500).json({ mensaje: "Error de configuración del servidor" });
        }

        // Generar token con rol y expiración
        const token = jwt.sign(
            {
                id: user.rows[0].id,
                rol: user.rows[0].rol
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({
            token,
            rol: user.rows[0].rol
        });

    } catch (err) {
        console.error("Error en login:", err.message);
        res.status(500).json({ mensaje: "Error de servidor" });
    }
});

module.exports = router;