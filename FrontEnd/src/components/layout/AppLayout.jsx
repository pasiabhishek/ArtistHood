import React from 'react'
import { Outlet } from 'react-router-dom'
import Left_nav from './Left_nav'
import Right_nav from './Right_nav'
export default function AppLayout() {
    return (
        <div>
            {/* Outlet renders whichever authenticated page matches the URL. */}
            <Left_nav/>
            <Outlet/>
            <Right_nav/>
        </div>
    )
}
