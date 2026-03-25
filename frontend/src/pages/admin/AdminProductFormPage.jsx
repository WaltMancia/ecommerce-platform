import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
    createProductService,
    updateProductService,
    getProductsService,
} from '../../services/product.service.js';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import toast from 'react-hot-toast';
import api from '../../services/api.js';

const AdminProductFormPage = () => {
    const { id } = useParams(); // Si hay id, es edición; si no, es creación
    const navigate = useNavigate();
    const isEditing = !!id;

    const [form, setForm] = useState({
        name: '', description: '', price: '', stock: '', category_id: '',
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditing);

    useEffect(() => {
        // Cargamos categorías para el select
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/categories');
                setCategories(data);
            } catch {
                toast.error('Error al cargar categorías');
            }
        };
        fetchCategories();

        // Si es edición, cargamos los datos del producto
        if (isEditing) {
            const fetchProduct = async () => {
                try {
                    const { data } = await api.get(`/products/id/${id}`);
                    setForm({
                        name: data.name,
                        description: data.description || '',
                        price: data.price,
                        stock: data.stock,
                        category_id: data.category?.id || '',
                    });
                } catch {
                    toast.error('Producto no encontrado');
                    navigate('/admin/productos');
                } finally {
                    setInitialLoading(false);
                }
            };
            fetchProduct();
        }
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditing) {
                await updateProductService(id, form);
                toast.success('Producto actualizado');
            } else {
                await createProductService(form);
                toast.success('Producto creado');
            }
            navigate('/admin/productos');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al guardar');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

    return (
        <div className="max-w-xl space-y-6">
            <button
                onClick={() => navigate('/admin/productos')}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft size={16} />
                Volver a productos
            </button>

            <h1 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Editar producto' : 'Nuevo producto'}
            </h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                {[
                    { name: 'name', label: 'Nombre', type: 'text', required: true },
                    { name: 'price', label: 'Precio', type: 'number', required: true, step: '0.01', min: '0' },
                    { name: 'stock', label: 'Stock', type: 'number', required: true, min: '0' },
                ].map(({ name, label, ...inputProps }) => (
                    <div key={name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                        <input
                            name={name}
                            value={form[name]}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            {...inputProps}
                        />
                    </div>
                ))}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                    <select
                        name="category_id"
                        value={form.category_id}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                    >
                        <option value="">Selecciona una categoría</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    <Button type="submit" loading={loading} className="flex-1">
                        {isEditing ? 'Guardar cambios' : 'Crear producto'}
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate('/admin/productos')}
                    >
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AdminProductFormPage;