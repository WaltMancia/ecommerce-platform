import { validationResult } from 'express-validator';

// Middleware genérico que ejecuta las validaciones y responde si hay errores
// Lo usaremos en todas las rutas que necesiten validación
export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Datos de entrada inválidos',
            errors: errors.array().map((err) => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }

    next();
};