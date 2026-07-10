import { useState, useEffect } from 'react'
import './App.css'
import Home from './component/pages/Home'
import Loader from './component/pages/Loader'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1800)

    return () => clearTimeout(timer)
  }, [])

  return loading ? <Loader /> : <Home />
}

export default App

