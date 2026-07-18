import { useState, useEffect } from 'react'
import './App.css'
import Home from './component/pages/Home'
import Loader from './component/pages/Loader'
import Login from './component/pages/Login'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1800)

    return () => clearTimeout(timer)
  }, [])

  return loading ? <Loader /> : <Login />
}

export default App

