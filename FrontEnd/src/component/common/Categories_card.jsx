import React from 'react'
import './Categories_card.css'
import { GiMicrophone } from "react-icons/gi";

export default function Categories_card() {
    const TopCats = [
        { id: 1, icon: "https://img.magnific.com/premium-vector/vector-man-singing-with-simple-silhouette-style_995281-6793.jpg?semt=ais_hybrid&w=740&q=80", name: "Singer" },
        { id: 2, icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-zN60eTq73yNjDzZciqu7mEbMXwOsBxhnEurla9p4xA&s=10", name: "Dancer" },
        { id: 3, icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw51L3R_JM_mEFqv7mRPe2R9m9gbP4HURNc2fJjd0PSg&s=10", name: "DJ" },
        { id: 4, icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOK8LoZqQYiaMxwEMsVpVZYGtKqjEM2T_Ig6THZTTOtW2d_0XLxWmZ0oM&s=10", name: "Band" },
        { id: 5, icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFu21-PKZcA5b6Fk1gvDVjxNe54dkjpIkOMLC3zeu1AA&s=10", name: "Actor" },
        { id: 6, icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTalT3WLvB7_UysyLpsUXP7-d2EWvv0A5tlFZ-hDziKyQ&s=10", name: "Anchor" }
    ];
    return (
        <div>
            <div className="TopCategories">
                <p className="Explore" className="">
                    Explore
                </p>
                <h3 className="Popular">
                    Popular Categoroes
                </h3>
                <div className="cardholder">
                    {TopCats.map((Cat) => (
                        <div className="card " key={Cat.id}>


                            <div className="categoiresIcon">
                                <img src={Cat.icon} alt="" srcset="" />


                            </div>
                            <div className="categoriesName">
                                {Cat.name}
                            </div>
                        </div>

                    ))}
                </div>
            </div>


        </div>
    )
}
