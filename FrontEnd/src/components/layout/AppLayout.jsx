import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftNav from './LeftNav'
import RightNav from './RightNav'
import Header from '../home/Header'
import Footer from './Footer'
import '../../styles/layout/AppLayout.css'
export default function AppLayout() {
    // The outlet changes while the navigation remains in place.
    return (
        <div className="app-layout">
            <Header />
            {/* Outlet renders whichever authenticated page matches the URL. */}
            <LeftNav />
            <Outlet />
            <RightNav />
            {/* <Footer /> */}
        </div>
    )
}
