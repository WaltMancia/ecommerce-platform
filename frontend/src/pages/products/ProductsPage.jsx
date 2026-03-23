import { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { getProductsService } from '../../services/product.service.js';
import ProductCard from '../../components/ProductCard.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Button from '../../components/ui/Button.jsx';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [page, setPage] = useState(1);

    // useCallback memoriza la función para no recrearla en cada render
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getProductsService({ page, limit: 12, search });
            setProducts(data.data);
            setPagination(data.pagination);
        } catch {
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1); // Reseteamos a la primera página al buscar
    };

    const clearSearch = () => {
        setSearch('');
        setSearchInput('');
        setPage(1);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
                    {pagination && (
                        <p className="text-sm text-gray-500 mt-1">
                            {pagination.total} productos disponibles
                        </p>
                    )}
                </div>

                {/* Buscador */}
                <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-72">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Buscar productos..."
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                        />
                    </div>
                    <Button type="submit" size="sm">
                        <SlidersHorizontal size={15} />
                        Buscar
                    </Button>
                    {search && (
                        <Button type="button" variant="secondary" size="sm" onClick={clearSearch}>
                            <X size={15} />
                        </Button>
                    )}
                </form>
            </div>

            {/* Filtro activo */}
            {search && (
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Resultados para:</span>
                    <span className="bg-gray-900 text-white px-3 py-1 rounded-full flex items-center gap-1">
                        "{search}"
                        <button onClick={clearSearch} className="ml-1 hover:text-gray-300">
                            <X size={12} />
                        </button>
                    </span>
                </div>
            )}

            {/* Grid de productos */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Spinner size="lg" />
                </div>
            ) : products.length === 0 ? (
                <EmptyState
                    icon="🔍"
                    title="No encontramos productos"
                    description={search ? `No hay resultados para "${search}"` : 'Aún no hay productos disponibles'}
                    action={search && <Button onClick={clearSearch} variant="secondary">Limpiar búsqueda</Button>}
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}

            {/* Paginación */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setPage((p) => p - 1)}
                        disabled={page === 1}
                    >
                        ← Anterior
                    </Button>

                    <div className="flex gap-1">
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === page
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page === pagination.totalPages}
                    >
                        Siguiente →
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;