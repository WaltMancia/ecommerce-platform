// DTO de respuesta: lo que el cliente recibe tras autenticarse
// Nunca se incluye el password aquí, aunque sea hasheado
export const authResponseDTO = (user, accessToken, refreshToken) => ({
    user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    },
    accessToken,
    refreshToken,
});

// DTO de usuario público: para cuando solo necesitas mostrar datos del usuario
export const userPublicDTO = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
});