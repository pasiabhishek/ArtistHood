import React from 'react'
import './Categories_card.css'
import { GiMicrophone } from "react-icons/gi";

export default function Categories_card() {
  const TopCats = [
        { id: 1, icon: <GiMicrophone />, name: "DJ" },
        { id: 2, icon: <GiMicrophone />, name: "Dancer" },
        { id: 3, icon: <GiMicrophone />, name: "singer" },
        { id: 4, icon: <GiMicrophone />, name: "Band" },
        { id: 5, icon: <GiMicrophone />, name: "Actor" },
        { id: 6, icon: <GiMicrophone />, name: "Anchor" }
    ];
    return (
        <div>
            <div className="TopCategories">
                <p className="Explore" className="m-200px">
                    Explore
                </p>
                <h3 className="Popular">
                    Popular Categoroes
                </h3>
                <div className="cardholder">
                    {TopCats.map((Cat) => (
                        <div className="card " key={Cat.id}>


                            <div className="categoiresIcon">
                                {Cat.icon}


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
