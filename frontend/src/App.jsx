import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';

// Páginas
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/products/ProductsPage.jsx';
import ProductDetailPage from './pages/products/ProductDetailPage.jsx';
import CartPage from './pages/cart/CartPage.jsx';
import OrdersPage from './pages/orders/OrdersPage.jsx';
import OrderDetailPage from './pages/orders/OrderDetailPage.jsx';
import AdminPage from './pages/admin/AdminPage.jsx';

const App = () => {
  return (
    <Routes>
      {/* Rutas públicas sin layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      {/* Rutas con layout (navbar + contenido) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/productos" element={<ProductsPage />} />
        <Route path="/productos/:slug" element={<ProductDetailPage />} />

        {/* Rutas protegidas — requieren login */}
        <Route path="/carrito" element={
          <ProtectedRoute><CartPage /></ProtectedRoute>
        } />
        <Route path="/mis-ordenes" element={
          <ProtectedRoute><OrdersPage /></ProtectedRoute>
        } />

        <Route path="/mis-ordenes/:id" element={
          <ProtectedRoute><OrderDetailPage /></ProtectedRoute>
        } />

        {/* Rutas de admin — requieren rol admin */}
        <Route path="/admin/*" element={
          <AdminRoute><AdminPage /></AdminRoute>
        } />
      </Route>

      {/* Cualquier ruta desconocida redirige al inicio */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;