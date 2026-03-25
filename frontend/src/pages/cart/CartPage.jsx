import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import useCart from '../../hooks/useCart.js';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { checkoutService } from '../../services/order.service.js';
import toast from 'react-hot-toast';
import { useState } from 'react';

const CartPage = () => {
    const { cart, updateItem, removeItem, fetchCart } = useCart();
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => { fetchCart(); }, []);

    const handleCheckout = async () => {
        setCheckoutLoading(true);
        try {
            const order = await checkoutService();
            toast.success('¡Orden creada exitosamente!');
            navigate(`/mis-ordenes/${order.id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al procesar la orden');
        } finally {
            setCheckoutLoading(false);
        }
    };

    if (!cart) return (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
    );

    if (cart.items.length === 0) return (
        <EmptyState
            icon="🛒"
            title="Tu carrito está vacío"
            description="Explora nuestro catálogo y añade productos que te gusten"
            action={
                <Link to="/productos">
                    <Button><ShoppingBag size={16} /> Ver productos</Button>
                </Link>
            }
        />
    );

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">
                Mi carrito
                <span className="ml-2 text-sm font-normal text-gray-400">
                    ({cart.items.length} {cart.items.length === 1 ? 'producto' : 'productos'})
                </span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista de items */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.items.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4">
                            {/* Imagen del producto */}
                            <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {item.product.imageUrl ? (
                                    <img
                                        src={item.product.imageUrl}
                                        alt={item.product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <ShoppingBag size={24} className="text-gray-300" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 truncate">{item.product.name}</h3>
                                <p className="text-sm text-gray-400 mt-0.5">${item.product.price.toFixed(2)} por unidad</p>

                                <div className="flex items-center justify-between mt-3">
                                    {/* Control de cantidad */}
                                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => item.quantity > 1
                                                ? updateItem(item.id, item.quantity - 1)
                                                : removeItem(item.id)
                                            }
                                            className="px-2.5 py-1.5 hover:bg-gray-50 transition-colors"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="px-3 py-1.5 text-sm font-medium min-w-[2.5rem] text-center">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateItem(item.id, item.quantity + 1)}
                                            disabled={item.quantity >= item.product.stock}
                                            className="px-2.5 py-1.5 hover:bg-gray-50 transition-colors disabled:opacity-40"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold text-gray-900">
                                            ${item.subtotal.toFixed(2)}
                                        </span>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Resumen de compra */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-6 space-y-4">
                        <h2 className="font-semibold text-gray-900 text-lg">Resumen</h2>

                        <div className="space-y-2 text-sm">
                            {cart.items.map((item) => (
                                <div key={item.id} className="flex justify-between text-gray-500">
                                    <span className="truncate max-w-[150px]">{item.product.name} x{item.quantity}</span>
                                    <span>${item.subtotal.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-3">
                            <div className="flex justify-between font-bold text-gray-900 text-lg">
                                <span>Total</span>
                                <span>${cart.total.toFixed(2)}</span>
                            </div>
                        </div>

                        <Button
                            size="lg"
                            className="w-full"
                            loading={checkoutLoading}
                            onClick={handleCheckout}
                        >
                            Proceder al pago
                            <ArrowRight size={16} />
                        </Button>

                        <Link to="/productos" className="block text-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
                            ← Seguir comprando
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;