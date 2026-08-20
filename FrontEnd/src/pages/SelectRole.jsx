import React from 'react'
import "./css/SelectRole.css"
import { Link } from 'react-router-dom'
export default function SelectRole() {
    return (
        <div className='SelectRole'>
            <h2>Define Your Role..</h2>
            <div className="buttonSet">
                <Link to='/feed'>
                    <button className='button'>Client</button>
                </Link>
                <Link to="/arist-signup">
                    <button className='button'>Artist</button>
                </Link>
            </div>
        </div>
    )
}
