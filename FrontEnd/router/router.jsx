import React from 'react'
import Home from '../src/component/pages/Home'

export default function Router() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>}/>
        </Routes>

      </BrowserRouter>
    </div>
  )
}