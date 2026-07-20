import React from 'react'
import Footer from '../common/Footer'
import { Outlet } from 'react-router-dom'
import Header from '../common/Header'

export default function MainLayout() {
    return (
        <div>
            <Header />
            <Outlet/>
            <Footer />
        </div>
    )
}
