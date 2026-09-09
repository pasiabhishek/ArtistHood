import React from 'react'
import "../../styles/auth/SelectRole.css"
import { Link } from 'react-router-dom'
import Header from '../../components/home/Header'
import Footer from '../../components/layout/Footer'
export default function SelectRole() {
    // The selected role decides which onboarding form opens next.
    return (
        <div className='SelectRole'>
            <Header />
            <h2>Define Your Role..</h2>
            <div className="buttonSet">
                <Link to='/feed'>
                    <button className='button'>Client</button>
                </Link>
                <Link to="/artist-signup">
                    <button className='button'>Artist</button>
                </Link>
            </div>
            <Footer />
        </div>
    )
}
