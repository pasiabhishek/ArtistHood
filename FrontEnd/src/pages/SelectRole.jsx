import React from 'react'
import "./css/SelectRole.css"
export default function SelectRole() {
    return (
        <div className='SelectRole'>
            <h2>Define Your Role..</h2>
            <div className="buttonSet">
                <button className='button'>Client</button>
                <button className='button'>Artist</button>
            </div>
        </div>
    )
}
