import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Package, ArrowLeft, CreditCard, CheckCircle } from 'lucide-react';
import { getOrderByIdService, createPaymentIntentService } from '../../services/order.service.js';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const statusConfig = {
    pending: { variant: 'warning', label: 'Pendiente de pago' },
    paid: { variant: 'success', label: 'Pagado' },
    shipped: { variant: 'info', label: 'En camino' },
    delivered: { variant: 'success', label: 'Entregado' },
    cancelled: { variant: 'danger', label: 'Cancelado' },
};

// Componente interno del formulario de pago
// Vive dentro de <Elements> que provee el contexto de Stripe
const CheckoutForm = ({ orderId, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                // En vez de redirigir, manejamos el resultado aquí mismo
                redirect: 'if_required',
            });

            if (error) {
                toast.error(error.message);
            } else if (paymentIntent.status === 'succeeded') {
                toast.success('¡Pago realizado exitosamente! 🎉');
                onSuccess();
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* PaymentElement renderiza el formulario completo de Stripe */}
            <PaymentElement />
            <Button
                type="submit"
                size="lg"
                className="w-full"
                loading={loading}
                // Idempotencia en frontend: el botón se deshabilita mientras procesa
                disabled={!stripe || !elements || loading}
            >
                <CreditCard size={18} />
                Confirmar pago
            </Button>
            <p className="text-xs text-center text-gray-400">
                🔒 Pago seguro procesado por Stripe. No almacenamos datos de tu tarjeta.
            </p>
        </form>
    );
};

const OrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);

    const fetchOrder = async () => {
        try {
            const data = await getOrderByIdService(id);
            setOrder(data);
            return data;
        } catch {
            navigate('/mis-ordenes');
        }
    };

    useEffect(() => {
        const init = async () => {
            const data = await fetchOrder();

            // Idempotencia: solo creamos PaymentIntent si la orden está pending
            // Si ya fue pagada o cancelada, no hacemos nada
            if (data?.status === 'pending') {
                await initPayment(data.id);
            }

            setLoading(false);
        };
        init();
    }, [id]);

    const initPayment = async (orderId) => {
        setPaymentLoading(true);
        try {
            // El backend también verifica idempotencia:
            // si la orden ya tiene stripe_payment_id, no crea otro
            const { clientSecret } = await createPaymentIntentService(orderId);
            setClientSecret(clientSecret);
        } catch (error) {
            toast.error('Error al inicializar el pago');
        } finally {
            setPaymentLoading(false);
        }
    };

    const handlePaymentSuccess = async () => {
        // Esperamos 2 segundos para que el webhook tenga tiempo de procesar
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await fetchOrder();
        setClientSecret(null);
    };

    if (loading) return (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
    );

    if (!order) return null;

    const status = statusConfig[order.status] || statusConfig.pending;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <button
                onClick={() => navigate('/mis-ordenes')}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft size={16} />
                Volver a mis órdenes
            </button>

            {/* Header de la orden */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Orden #{order.id}</h1>
                        <p className="text-sm text-gray-400 mt-1">
                            {new Date(order.createdAt).toLocaleDateString('es-ES', {
                                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                        </p>
                    </div>
                    <Badge variant={status.variant}>{status.label}</Badge>
                </div>

                {/* Items de la orden */}
                <div className="space-y-3">
                    {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {item.product?.imageUrl ? (
                                        <img
                                            src={item.product.imageUrl}
                                            alt={item.product?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Package size={16} className="text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{item.product?.name}</p>
                                    <p className="text-xs text-gray-400">x{item.quantity} · ${item.unitPrice.toFixed(2)} c/u</p>
                                </div>
                            </div>
                            <span className="font-medium text-gray-900">${item.subtotal.toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-100">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900">${order.total.toFixed(2)}</span>
                </div>
            </div>

            {/* Sección de pago */}
            {order.status === 'paid' && (
                <div className="bg-green-50 rounded-2xl border border-green-100 p-6 flex items-center gap-4">
                    <CheckCircle size={28} className="text-green-500 flex-shrink-0" />
                    <div>
                        <p className="font-semibold text-green-800">¡Pago confirmado!</p>
                        <p className="text-sm text-green-600 mt-0.5">
                            Tu pago fue procesado exitosamente. Pronto recibirás tu pedido.
                        </p>
                    </div>
                </div>
            )}

            {order.status === 'pending' && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                    <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                        <CreditCard size={18} />
                        Completar pago
                    </h2>

                    {paymentLoading ? (
                        <div className="flex justify-center py-8"><Spinner /></div>
                    ) : clientSecret ? (
                        // Elements provee el contexto de Stripe a todos los componentes hijos
                        <Elements
                            stripe={stripePromise}
                            options={{
                                clientSecret,
                                appearance: {
                                    theme: 'stripe',
                                    variables: { borderRadius: '12px' }
                                }
                            }}
                        >
                            <CheckoutForm orderId={order.id} onSuccess={handlePaymentSuccess} />
                        </Elements>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default OrderDetailPage;