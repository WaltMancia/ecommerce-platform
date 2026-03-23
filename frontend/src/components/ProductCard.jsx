import { Link } from 'react-router-dom';
import { ShoppingCart, Package } from 'lucide-react';
import Button from './ui/Button.jsx';
import Badge from './ui/Badge.jsx';
import useCart from '../hooks/useCart.js';
import useAuthStore from '../store/authStore.js';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const handleAddToCart = async (e) => {
        // Evitamos que el clic navegue al detalle del producto
        e.preventDefault();
        if (!user) {
            toast.error('Inicia sesión para añadir al carrito');
            navigate('/login');
            return;
        }
        await addToCart(product.id);
    };

    return (
        <Link to={`/productos/${product.slug}`} className="group block">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                {/* Imagen placeholder */}
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Package size={48} className="text-gray-300" />
                    </div>
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">Agotado</span>
                        </div>
                    )}
                    {product.stock > 0 && product.stock <= 5 && (
                        <div className="absolute top-3 left-3">
                            <Badge variant="warning">¡Últimas {product.stock} unidades!</Badge>
                        </div>
                    )}
                </div>

                <div className="p-4">
                    {/* Categoría */}
                    {product.category && (
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                            {product.category.name}
                        </span>
                    )}

                    {/* Nombre */}
                    <h3 className="font-semibold text-gray-900 mt-1 mb-2 line-clamp-2 group-hover:text-gray-600 transition-colors">
                        {product.name}
                    </h3>

                    {/* Precio y botón */}
                    <div className="flex items-center justify-between mt-3">
                        <span className="text-xl font-bold text-gray-900">
                            ${product.price.toFixed(2)}
                        </span>
                        <Button
                            size="sm"
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="rounded-xl"
                        >
                            <ShoppingCart size={15} />
                            Añadir
                        </Button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;