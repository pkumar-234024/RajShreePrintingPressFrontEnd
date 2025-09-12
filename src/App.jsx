
import './App.css'
import HeroSection from './components/HeroSection'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import About from './pages/About'
import Contactus from './pages/Contactus'
import CardDetail from './components/CardDetail'
import ProductCatalog from './pages/ProductCatalog'
import { CartProvider } from './context/CartContext'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminProductForm from './components/admin/AdminProductForm'
import AdminOrders from './components/admin/AdminOrders'
import AdminCategories from './components/admin/AdminCategories'
import AdminProducts from './components/admin/AdminProducts'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HeroSection />}>
            <Route path="/about" element={<About />} />
            <Route path="/contactus" element={<Contactus />} />
            <Route path="/products" element={<ProductCatalog />} />
            <Route path="card/:id" element={<CardDetail />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/products" element={
            <ProtectedRoute>
              <AdminProducts />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/products/add" element={
            <ProtectedRoute>
              <AdminProductForm />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/products/edit/:id" element={
            <ProtectedRoute>
              <AdminProductForm />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/orders" element={
            <ProtectedRoute>
              <AdminOrders />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/categories" element={
            <ProtectedRoute>
              <AdminCategories />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </CartProvider>
  )
}

export default App
