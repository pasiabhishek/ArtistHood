import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import './App.css'
import Home from './component/pages/Home'
import Loader from './component/pages/Loader'
import Login from './component/pages/Login'
import MainLayout from './component/pages/MainLayout'
import Error404 from './component/pages/Error404'

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

          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}



export default App

