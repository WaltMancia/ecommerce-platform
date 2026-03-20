import Cart from '../database/models/Cart.js';
import CartItem from '../database/models/CartItem.js';
import Product from '../database/models/Product.js';

// Include reutilizable con los datos necesarios del carrito
const cartInclude = {
    model: CartItem,
    as: 'items',
    include: [
        {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'slug', 'price', 'stock'],
        },
    ],
};

export const findOrCreateCart = async (userId) => {
    // findOrCreate busca el registro, y si no existe lo crea
    // Devuelve [instancia, fueCreado]
    const [cart] = await Cart.findOrCreate({
        where: { user_id: userId },
        defaults: { user_id: userId },
        include: [cartInclude],
    });

    // Recargamos para asegurarnos de tener los items incluidos
    return await Cart.findOne({
        where: { id: cart.id },
        include: [cartInclude],
    });
};

export const findCartItem = async (cartId, productId) => {
    return await CartItem.findOne({
        where: { cart_id: cartId, product_id: productId },
    });
};

export const addCartItem = async (cartId, productId, quantity) => {
    return await CartItem.create({ cart_id: cartId, product_id: productId, quantity });
};

export const updateCartItem = async (id, quantity) => {
    await CartItem.update({ quantity }, { where: { id } });
};

export const removeCartItem = async (id) => {
    await CartItem.destroy({ where: { id } });
};

export const clearCart = async (cartId) => {
    await CartItem.destroy({ where: { cart_id: cartId } });
};