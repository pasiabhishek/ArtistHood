import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Loader from './component/loader.jsx'
import Home from './component/pages/Home.jsx'



 
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Loader/> 
  </StrictMode>,
)
