const validarReserva = (req, res, next) => {
    const { nombre, email, fecha, hora, personas } = req.body;

    // Validar campos vacíos (mejorado)
    if (!nombre || !email || !fecha || !hora || personas === undefined) {
        console.warn("[DEBUGGING]: Campos incompletos en reserva");
        return res.status(400).json({
            mensaje: "Faltan datos obligatorios (nombre, email, fecha, hora o personas)."
        });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.warn(`[DEBUGGING]: Email inválido: ${email}`);
        return res.status(400).json({
            mensaje: "El formato del correo electrónico es inválido."
        });
    }

    // Validar personas correctamente
    const numPersonas = Number(personas);

    if (!Number.isInteger(numPersonas) || numPersonas <= 0) {
        console.warn(`[DEBUGGING]: Personas inválido: ${personas}`);
        return res.status(400).json({
            mensaje: "La cantidad de personas debe ser un número entero mayor a cero."
        });
    }
    next();
};

module.exports = validarReserva;