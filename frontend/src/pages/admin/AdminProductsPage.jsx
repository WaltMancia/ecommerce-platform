import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { getProductsService, deleteProductService } from '../../services/product.service.js';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import toast from 'react-hot-toast';

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    const fetchProducts = async () => {
        try {
            const data = await getProductsService({ limit: 50 });
            setProducts(data.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleDelete = async (id, name) => {
        if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
        setDeletingId(id);
        try {
            await deleteProductService(id);
            toast.success('Producto eliminado');
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch {
            toast.error('Error al eliminar el producto');
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Productos</h2>
                <Link to="/admin/productos/nuevo">
                    <Button size="sm">
                        <Plus size={16} /> Nuevo producto
                    </Button>
                </Link>
            </div>

            {products.length === 0 ? (
                <EmptyState
                    icon="📦"
                    title="Sin productos"
                    description="Crea tu primer producto"
                    action={
                        <Link to="/admin/productos/nuevo">
                            <Button><Plus size={16} /> Crear producto</Button>
                        </Link>
                    }
                />
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-5 py-3 text-gray-500 font-medium">Producto</th>
                                <th className="text-left px-5 py-3 text-gray-500 font-medium">Categoría</th>
                                <th className="text-left px-5 py-3 text-gray-500 font-medium">Precio</th>
                                <th className="text-left px-5 py-3 text-gray-500 font-medium">Stock</th>
                                <th className="px-5 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                {product.imageUrl ? (
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Package size={16} className="text-gray-400" />
                                                )}
                                            </div>
                                            <span className="font-medium text-gray-900 truncate max-w-[200px]">
                                                {product.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-gray-500">{product.category?.name || '—'}</td>
                                    <td className="px-5 py-3 font-medium text-gray-900">${product.price.toFixed(2)}</td>
                                    <td className="px-5 py-3">
                                        <Badge variant={product.stock === 0 ? 'danger' : product.stock <= 5 ? 'warning' : 'success'}>
                                            {product.stock} uds
                                        </Badge>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link to={`/admin/productos/editar/${product.id}`}>
                                                <Button variant="ghost" size="sm">
                                                    <Pencil size={14} />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                loading={deletingId === product.id}
                                                onClick={() => handleDelete(product.id, product.name)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminProductsPage;