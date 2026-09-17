import React from 'react'
import { useParams } from 'react-router-dom'

export default function Post() {
    const { _id } = useParams();

    return (
        <div>
            <h3>post : {_id}</h3>
        </div>
    )
}
