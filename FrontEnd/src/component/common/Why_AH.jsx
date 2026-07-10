import React from 'react'

export default function why_AH() {
  return (
    <div>
      <div className="TopCategories">
        <p className="Explore">
          Why Choose Us
        </p>
        <h3 className="Popular">
         Why Artist Hood?
        </h3>
      </div >
      <div className="Why_Reason w-100vw h-40 m-10 ">
        <div className="app_features w-50 h-20 flex border-1 m-10 md:(w-50 h-25) " >
          <div className="img w-50 h-25 p-10 m-6 flex justify-center items-center">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgMcA4FrZEPIocT2ssTCRiFYWb2_M_V8b4Ss_oFh2xIw&s=10" alt="" srcset="" className='w-30 h-20 md:w-30' />
          </div>
          <div className="feature_data w-80 p-10">
            <h3 className='font-bold text-1xl text-left'>Verified Artists</h3>
            <p className='font-light text-1xl text-left'>
              All artists are verified and quality checked.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
