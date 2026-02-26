const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const { nombre, email, password } = req.body;
    
    // --- MEJORA: Asignación automática de ROL ---
    const correoAdmin = "admin@museocalico.com"; 
    const rolAsignado = (email === correoAdmin) ? 'admin' : 'usuario';

    try {
        const hash = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4)',
            [nombre, email, hash, rolAsignado]
        );
        res.status(201).json({ mensaje: "Usuario creado con rol: " + rolAsignado });
    } catch (err) {
        res.status(500).json({ mensaje: "Error: El correo ya existe o falta la columna rol" });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        
        if (user.rows.length > 0 && await bcrypt.compare(password, user.rows[0].password)) {
            // --- MEJORA: El Token ahora incluye el ROL ---
            const token = jwt.sign(
                { 
                    id: user.rows[0].id, 
                    rol: user.rows[0].rol // <--- Ahora el "guardia" sabrá quién es admin
                }, 
                process.env.JWT_SECRET || 'secreto'
            );
            res.json({ token, rol: user.rows[0].rol });
        } else {
            res.status(401).json({ mensaje: "Datos incorrectos" });
        }
    } catch (err) { 
        res.status(500).json({ mensaje: "Error de servidor" }); 
    }
});

module.exports = router;