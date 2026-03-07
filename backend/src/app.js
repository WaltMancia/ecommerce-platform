import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './interfaces/routes/auth.routes.js';
import { errorHandler } from './interfaces/middlewares/error.middleware.js';

dotenv.config();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Versionamiento de API: /api/v1 es la ruta base para todas las rutas de autenticación
app.use('/api/v1/auth', authRoutes);
// Health check 
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// El error handler SIEMPRE va al final, después de todas las rutas
app.use(errorHandler);

export default app;