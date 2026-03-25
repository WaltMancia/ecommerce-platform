import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';
import { getMyOrdersService } from '../../services/order.service.js';
import Spinner from '../../components/ui/Spinner.jsx';
import Badge from '../../components/ui/Badge.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Button from '../../components/ui/Button.jsx';

// Mapeamos los status a variantes visuales y texto en español
const statusConfig = {
    pending: { variant: 'warning', label: 'Pendiente de pago' },
    paid: { variant: 'success', label: 'Pagado' },
    shipped: { variant: 'info', label: 'En camino' },
    delivered: { variant: 'success', label: 'Entregado' },
    cancelled: { variant: 'danger', label: 'Cancelado' },
};

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await getMyOrdersService();
                setOrders(data);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

    if (orders.length === 0) return (
        <EmptyState
            icon="📦"
            title="Aún no tienes órdenes"
            description="Cuando realices una compra, aparecerá aquí"
            action={
                <Link to="/productos">
                    <Button><ShoppingBag size={16} /> Ir a comprar</Button>
                </Link>
            }
        />
    );

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Mis órdenes</h1>

            <div className="space-y-3">
                {orders.map((order) => {
                    const status = statusConfig[order.status] || statusConfig.pending;
                    return (
                        <Link
                            key={order.id}
                            to={`/mis-ordenes/${order.id}`}
                            className="block bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-gray-100 rounded-xl">
                                        <Package size={20} className="text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Orden #{order.id}</p>
                                        <p className="text-sm text-gray-400 mt-0.5">
                                            {new Date(order.createdAt).toLocaleDateString('es-ES', {
                                                year: 'numeric', month: 'long', day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                                        <Badge variant={status.variant} className="mt-1">{status.label}</Badge>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-400" />
                                </div>
                            </div>

                            {/* Items resumidos */}
                            {order.items?.length > 0 && (
                                <p className="text-sm text-gray-400 mt-3 pl-14">
                                    {order.items.slice(0, 2).map(i => i.product?.name).join(', ')}
                                    {order.items.length > 2 && ` y ${order.items.length - 2} más`}
                                </p>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default OrdersPage;