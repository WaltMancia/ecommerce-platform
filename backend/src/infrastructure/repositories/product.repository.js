import { Op } from 'sequelize';
import Product from '../database/models/Product.js';
import Category from '../database/models/Category.js';

// Opciones de include reutilizables — evita repetir código
const categoryInclude = {
    model: Category,
    as: 'category',
    attributes: ['id', 'name', 'slug'], // Solo traemos estos campos de Category
};

export const findAllProducts = async ({ limit, offset, search, categoryId }) => {
    // Construimos el where dinámicamente según los filtros que lleguen
    const where = { is_active: true };

    if (search) {
        // Op.like es el LIKE de SQL — busca coincidencias parciales
        where.name = { [Op.like]: `%${search}%` };
    }

    if (categoryId) {
        where.category_id = categoryId;
    }

    // findAndCountAll devuelve { count, rows }
    // count = total de registros (para la paginación)
    // rows  = solo los registros de esta página
    return await Product.findAndCountAll({
        where,
        include: [categoryInclude],
        limit,    // cuántos traer
        offset,   // desde cuál empezar (page - 1) * limit
        order: [['created_at', 'DESC']],
    });
};

export const findProductBySlug = async (slug) => {
    return await Product.findOne({
        where: { slug, is_active: true },
        include: [categoryInclude],
    });
};

export const findProductById = async (id) => {
    return await Product.findOne({
        where: { id },
        include: [categoryInclude],
    });
};

export const findProductBySlugExcludingId = async (slug, excludeId) => {
    // Usado al actualizar para verificar que el slug no lo use otro producto
    return await Product.findOne({
        where: { slug, id: { [Op.ne]: excludeId } }, // Op.ne = Not Equal
    });
};

export const createProduct = async (productData) => {
    return await Product.create(productData);
};

export const updateProduct = async (id, productData) => {
    await Product.update(productData, { where: { id } });
    return await findProductById(id);
};

export const deleteProduct = async (id) => {
    // Soft delete: marcamos como inactivo en vez de borrar
    // El historial de órdenes que referencian este producto permanece intacto
    await Product.update({ is_active: false }, { where: { id } });
};