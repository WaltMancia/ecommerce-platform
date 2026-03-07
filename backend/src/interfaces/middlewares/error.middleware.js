// Este middleware recibe 4 parámetros, Express lo identifica como manejador de errores
export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    // En desarrollo mostramos el stack trace para debuggear
    // En producción nunca exponemos detalles internos
    const response = {
        message: err.message || 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    };

    res.status(statusCode).json(response);
};