import React from 'react'
import './Home.css'
import Header from '../common/Header'
import Hero from '../common/Hero'

export default function Home() {
    return (
        <div>
            <Hero />
            <div className="TopCategories">
                <p className="Explore" className="m-200px">
                    Explore
                </p>
                <h3 className="Popular">
                    Popular Categoroes
                </h3>
            </div>
        </div>
    )
}

function Categories_card(){
    return(
        <div className="card">
            <div className="categoiresIcon">
                
            </div>        
            <div className="categoriesName">
                singer
            </div>   
        </div>
    )
}