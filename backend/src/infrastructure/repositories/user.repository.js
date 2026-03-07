import User from '../database/models/User.js';

// Cada método representa una operación con la BD
// Los servicios llaman a estos métodos, nunca a Sequelize directamente

export const findUserByEmail = async (email) => {
    return await User.findOne({ where: { email } });
};

export const findUserById = async (id) => {
    return await User.findOne({ where: { id, is_active: true } });
};

export const createUser = async (userData) => {
    return await User.create(userData);
};