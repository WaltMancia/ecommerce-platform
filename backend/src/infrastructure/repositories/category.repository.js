import Category from '../database/models/Category.js';

export const findAllCategories = async () => {
    return await Category.findAll({ order: [['name', 'ASC']] });
};