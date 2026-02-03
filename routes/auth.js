const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../db'); 
const bcrypt = require('bcryptjs');

// Registro
router.post('/register', async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const sql = 'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3)';
        
        pool.query(sql, [nombre, email, hashedPassword], (err, result) => {
            if (err) {
                console.error("ERROR EN POSTGRES:", err.message); 
                return res.status(500).json({ mensaje: "Error al registrar usuario" });
            }
            res.status(201).json({ mensaje: "Usuario registrado con éxito" });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    pool.query('SELECT * FROM usuarios WHERE email = $1', [email], async (err, result) => {
        if (err) {
            console.error("ERROR EN LOGIN:", err.message);
            return res.status(500).json({ error: "Error en el servidor" });
        }
        
        if (result.rows.length === 0) {
            return res.status(400).json({ mensaje: "Usuario no encontrado" });
        }
        const usuario = result.rows[0];
        const validPass = await bcrypt.compare(password, usuario.password);
        
        if (!validPass) {
            return res.status(400).json({ mensaje: "Contraseña incorrecta" });
        }

        // Genera el Token
        const token = jwt.sign(
            { id: usuario.id }, 
            process.env.JWT_SECRET || 'museo_secreto_fallback', 
            { expiresIn: '2h' }
        );

        res.json({ 
            mensaje: "Login exitoso", 
            token: token,
            usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
        });
    });
});

module.exports = router;
