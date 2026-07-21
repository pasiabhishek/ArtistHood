import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './component/pages/Home'
import Loader from './component/pages/Loader'
import Login from './component/pages/Login'
import MainLayout from './component/pages/MainLayout'
import Error404 from './component/pages/Error404'
import SitePage from './component/pages/SitePage'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1800)

    return () => clearTimeout(timer)
  }, [])

  if (loading) return <Loader />

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Error404 />} />

          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/artist" element={<SitePage page="artists" />} />
            <Route path="/categories" element={<SitePage page="categories" />} />
            <Route path="/about" element={<SitePage page="about" />} />
            <Route path="/contact" element={<SitePage page="contact" />} />
            <Route path="/careers" element={<SitePage page="careers" />} />
            <Route path="/privacy" element={<SitePage page="privacy" />} />
            <Route path="/terms" element={<SitePage page="terms" />} />
            <Route path="/refunds" element={<SitePage page="refunds" />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}



export default App

