
import './App.css'
import HeroSection from './components/HeroSection'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import About from './pages/about/About'
import Contactus from './pages/contacts/Contactus'
import CardDetail from './components/CardDetail'
import ProductCatalog from './pages/products/ProductCatalog'
import { CartProvider } from './context/CartContext'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProductForm from './pages/admin/AdminProductForm'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCategories from './pages/admin/AdminCategories'
import AdminProducts from './pages/admin/AdminProducts'
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
