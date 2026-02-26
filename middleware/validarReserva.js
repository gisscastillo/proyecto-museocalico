const validarReserva = (req, res, next) => {
    const { nombre, email, fecha, hora, personas } = req.body;

    // 1. Revisar que no falte NINGÚN campo
    if (!nombre || !email || !fecha || !hora || !personas) {
        console.warn("[DEBUGGING]: Intento de reserva con campos incompletos."); // Línea para Debugging
        return res.status(400).json({ 
            mensaje: "Faltan datos obligatorios (nombre, email, fecha, hora o personas)." 
        });
    }

    // 2. Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.warn(`[DEBUGGING]: Email inválido detectado: ${email}`); // Línea para Debugging
        return res.status(400).json({ mensaje: "El formato del correo electrónico es inválido." });
    }

    // 3. Validar que 'personas' sea un número positivo
    if (isNaN(personas) || personas <= 0) {
        console.warn(`[DEBUGGING]: Valor de personas inválido: ${personas}`); // Línea para Debugging
        return res.status(400).json({ mensaje: "La cantidad de personas debe ser un número mayor a cero." });
    }

    // Si todo está correcto, permite que el código siga a la ruta
    next();
};

module.exports = validarReserva;