import * as authService from '../../application/services/auth.service.js';

export const register = async (req, res, next) => {
    try {
        const result = await authService.registerService(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error); // Pasa el error al middleware centralizado
    }
};

export const login = async (req, res, next) => {
    try {
        const result = await authService.loginService(req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const result = await authService.refreshTokenService(refreshToken);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// Endpoint protegido para verificar que el token funciona
export const getMe = async (req, res) => {
    // req.user viene del middleware authenticate
    res.status(200).json({ user: req.user });
};