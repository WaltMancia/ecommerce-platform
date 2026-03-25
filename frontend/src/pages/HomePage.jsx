import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, Shield, Headphones } from 'lucide-react';
import Button from '../components/ui/Button.jsx';

const features = [
    { icon: Truck, title: 'Envío gratis', desc: 'En pedidos mayores a $50' },
    { icon: Shield, title: 'Compra segura', desc: 'Pagos 100% protegidos' },
    { icon: Headphones, title: 'Soporte 24/7', desc: 'Siempre disponibles para ti' },
];

const HomePage = () => (
    <div className="space-y-20">
        {/* Hero */}
        <section className="relative rounded-3xl overflow-hidden bg-gray-900 text-white px-10 py-24">
            <div className="relative z-10 max-w-xl">
                <span className="inline-block bg-white/10 text-white text-sm px-3 py-1 rounded-full mb-4">
                    ✨ Nuevos productos disponibles
                </span>
                <h1 className="text-5xl font-bold leading-tight mb-4">
                    Todo lo que necesitas,<br />en un solo lugar
                </h1>
                <p className="text-gray-400 text-lg mb-8">
                    Descubre nuestra colección de productos con la mejor calidad y precios.
                </p>
                <Link to="/productos">
                    <Button size="lg" variant="secondary">
                        <ShoppingBag size={18} />
                        Ver productos
                    </Button>
                </Link>
            </div>
            {/* Círculos decorativos */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 right-24 w-64 h-64 bg-white/5 rounded-full translate-y-1/2" />
        </section>

        {/* Features */}
        <section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="p-3 bg-gray-100 rounded-xl">
                            <Icon size={22} className="text-gray-700" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{title}</h3>
                            <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* CTA */}
        <section className="text-center py-12 bg-white rounded-3xl border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">¿Listo para explorar?</h2>
            <p className="text-gray-500 mb-6">Más de 100 productos esperándote</p>
            <Link to="/productos">
                <Button size="lg">Ver catálogo completo</Button>
            </Link>
        </section>
    </div>
);

export default HomePage;