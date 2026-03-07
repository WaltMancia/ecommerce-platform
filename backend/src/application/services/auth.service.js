import bcrypt from 'bcryptjs';
import * as userRepository from '../../infrastructure/repositories/user.repository.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../infrastructure/utils/jwt.utils.js';
import { authResponseDTO, userPublicDTO } from '../dtos/auth.dto.js';

export const registerService = async ({ name, email, password }) => {
    // Verificamos si el email ya está registrado
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
        // Lanzamos un error con código HTTP incluido
        // El controller lo captura y responde apropiadamente
        const error = new Error('El correo electrónico ya está registrado');
        error.statusCode = 409; // Conflict
        throw error;
    }

    // bcrypt hashea la contraseña. El "10" es el saltRounds:
    // cuántas veces procesa el hash. Más alto = más seguro pero más lento.
    // 10 es el estándar recomendado para producción.
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userRepository.createUser({
        name,
        email,
        password: hashedPassword,
    });

    // El payload del token solo lleva lo mínimo necesario
    const payload = { userId: user.id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return authResponseDTO(user, accessToken, refreshToken);
};

export const loginService = async ({ email, password }) => {
    const user = await userRepository.findUserByEmail(email);

    // Importante: mismo mensaje de error para usuario no encontrado
    // y contraseña incorrecta. No le digas al atacante cuál falló.
    if (!user || !user.is_active) {
        const error = new Error('Credenciales inválidas');
        error.statusCode = 401;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        const error = new Error('Credenciales inválidas');
        error.statusCode = 401;
        throw error;
    }

    const payload = { userId: user.id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return authResponseDTO(user, accessToken, refreshToken);
};

export const refreshTokenService = async (refreshToken) => {
    if (!refreshToken) {
        const error = new Error('Refresh token requerido');
        error.statusCode = 401;
        throw error;
    }

    // verifyRefreshToken lanza error automáticamente si es inválido o expiró
    const decoded = verifyRefreshToken(refreshToken);

    const user = await userRepository.findUserById(decoded.userId);
    if (!user) {
        const error = new Error('Usuario no encontrado');
        error.statusCode = 401;
        throw error;
    }

    // Solo generamos un nuevo Access Token, el Refresh Token sigue siendo el mismo
    const payload = { userId: user.id, role: user.role };
    const newAccessToken = generateAccessToken(payload);

    return { accessToken: newAccessToken, user: userPublicDTO(user) };
};