// Librería para trabajar con tokens JWT
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    // Se obtiene el token 
    const token = req.header('auth-token');
    if (!token) return res.status(401).json({ mensaje: 'Acceso denegado. No hay token.' });

    try {
        // Valida el token usando la clave secreta guardada 
        const verificado = jwt.verify(token, process.env.JWT_SECRET);

        // Si es válido, se guardan los datos
        req.user = verificado;
        next();
    } catch (error) {
        res.status(400).json({ mensaje: 'Token no válido o expirado' });
    }
};
