import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Loader from './component/pages/Loader.jsx'
import Home from './component/pages/Home.jsx'
import Why_AH from './component/common/Why_AH.jsx'
import Feed from './component/pages/Feed.jsx'




createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <Feed/>
  </StrictMode>,
)
