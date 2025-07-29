
import './App.css'
import HeroSection from './components/HeroSection'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import About from './components/About'
import Contactus from './components/Contactus'
import CardDetail from './components/CardDetail';
function App() {

  return (
    <>
      <Router>
      <Routes>
          <Route path="/" element={<HeroSection />} >
            <Route path="/about" element={<About />} />
            <Route path="/contactus" element={<Contactus />} />
            <Route path="card/:id" element={<CardDetail />} />
          </Route>
          
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
      </>
    )
  }

export default App
