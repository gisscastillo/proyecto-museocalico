const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ mensaje: 'Acceso denegado. No hay token.' });
    }

    try {

        const token = authHeader.split(' ')[1];

        const verificado = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verificado;

        next();
    } catch (error) {
        res.status(400).json({ mensaje: 'Token no válido o expirado' });
    }
};