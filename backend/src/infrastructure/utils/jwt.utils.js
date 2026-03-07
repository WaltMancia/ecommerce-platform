import jwt from 'jsonwebtoken';

// Genera el Access Token de corta duración
export const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN, // 15m
    });
};

// Genera el Refresh Token de larga duración
export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN, // 7d
    });
};

// Verifica y decodifica un Access Token
// Si es inválido o expiró, lanza un error automáticamente
export const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

// Verifica y decodifica un Refresh Token
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};