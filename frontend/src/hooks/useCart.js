import { useEffect } from 'react';
import toast from 'react-hot-toast';
import useCartStore from '../store/cartStore.js';
import useAuthStore from '../store/authStore.js';
import {
    getCartService,
    addToCartService,
    updateCartItemService,
    removeFromCartService,
} from '../services/cart.service.js';

const useCart = () => {
    const { cart, setCart, itemCount } = useCartStore();
    const { user } = useAuthStore();

    // Carga el carrito cuando el usuario está autenticado
    useEffect(() => {
        if (user) fetchCart();
    }, [user]);

    const fetchCart = async () => {
        try {
            const data = await getCartService();
            setCart(data);
        } catch {
            // Si falla silenciosamente no rompemos la UI
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        try {
            const data = await addToCartService(productId, quantity);
            setCart(data);
            toast.success('Producto añadido al carrito 🛒');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al añadir al carrito');
        }
    };

    const updateItem = async (itemId, quantity) => {
        try {
            const data = await updateCartItemService(itemId, quantity);
            setCart(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al actualizar');
        }
    };

    const removeItem = async (itemId) => {
        try {
            const data = await removeFromCartService(itemId);
            setCart(data);
            toast.success('Producto eliminado del carrito');
        } catch (error) {
            toast.error('Error al eliminar el producto');
        }
    };

    return { cart, itemCount, addToCart, updateItem, removeItem, fetchCart };
};

export default useCart;