import { verifyAccessToken } from '../../infrastructure/utils/jwt.utils.js';

export const authenticate = (req, res, next) => {
    // El token viene en el header: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token de acceso requerido' });
    }

    const token = authHeader.split(' ')[1]; // Extraemos solo el token

    try {
        const decoded = verifyAccessToken(token);
        req.user = decoded; // Adjuntamos el payload al request para usarlo después
        next(); // Todo bien, continúa al controller
    } catch (error) {
        // jwt.verify lanza 'TokenExpiredError' o 'JsonWebTokenError'
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado' });
        }
        return res.status(401).json({ message: 'Token inválido' });
    }
};

// Middleware de autorización por roles
// Uso: router.delete('/users/:id', authenticate, authorize('admin'), controller)
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'No tienes permisos para realizar esta acción',
            });
        }
        next();
    };
};