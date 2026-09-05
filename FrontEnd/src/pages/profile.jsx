import React from 'react'
import "./css/Profile.css"

export default function Profile() {
  return (
    <div className='profile'>
      <div className="profile-banner">

      </div>

      <div className="profile-container">
        <div className="profile-container-header">
          <div className="profile-container-header-left">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm6GybZiSRCLgbg676yqaThLhkGzj3TgCIhOVvbCDwFA&s=10" alt="profile-pic" />
          </div>

          {/*  */}
          <div className="profile-container-header-right">
            <div className="profile-container-header-right-name">
              <h1>Master Aazam</h1>
            </div>
            <div className="profile-container-header-right-username">
              @masteraazam
            </div>
            <div className="profile-container-header-right-profession">
              poet
            </div>
            <div className="profile-container-header-right-bio">
              i am master aazam. a writer and poet
            </div>
          </div>
        </div>


        <div className="profile-container-header2">
        </div>

      </div>
    </div>
  )
}
