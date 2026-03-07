import { Router } from 'express';
import { register, login, refreshToken, getMe } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Rutas públicas
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

// Ruta protegida (requiere token válido)
router.get('/me', authenticate, getMe);

export default router;
