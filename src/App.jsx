
import './App.css'
import HeroSection from './components/HeroSection'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import About from './components/About'
import Contactus from './components/Contactus'
import CardDetail from './components/CardDetail'
import ProductCatalog from './components/ProductCatalog'
import { CartProvider } from './context/CartContext'

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HeroSection />}>
            <Route path="/about" element={<About />} />
            <Route path="/contactus" element={<Contactus />} />
            <Route path="/products" element={<ProductCatalog />} />
            <Route path="card/:id" element={<CardDetail />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  )
}

export default App
