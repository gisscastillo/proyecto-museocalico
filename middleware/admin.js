module.exports = (req, res, next) => {
    try {
        // req.user viene del authMiddleware
        if (!req.user || req.user.rol !== 'admin') {
            return res.status(403).json({
                mensaje: "Acceso denegado: solo administradores"
            });
        }

        next();
    } catch (error) {
        console.error("Error en soloAdmin:", error.message);
        res.status(500).json({ mensaje: "Error verificando permisos" });
    }
};