import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftNav from './LeftNav'
import RightNav from './RightNav'
export default function AppLayout() {
    return (
        <div>
            {/* Outlet renders whichever authenticated page matches the URL. */}
            <LeftNav />
            <Outlet />
            <RightNav />

        </div>
    )
}
