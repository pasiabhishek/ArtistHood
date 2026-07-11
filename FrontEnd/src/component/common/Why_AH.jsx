import React from "react";

let feature_json = [
  {
    "id": 1,
    "title": "Verified Artists",
    "description": "All artists are verified and quality checked.",
    "icon": "verified",
    "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgMcA4FrZEPIocT2ssTCRiFYWb2_M_V8b4Ss_oFh2xIw&s=10"
  },
  {
    "id": 2,
    "title": "Secure Payments",
    "description": "100% secure payments with multiple options.",
    "icon": "payments",
    "src": "data:image/png;base64,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"

  },
  {
    "id": 3,
    "title": "Instant Booking",
    "description": "Books instantly and get confirmation in seconds.",
    "icon": "booking",
    "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYDfS-G8Sa3xw11yZ5hvKBnoVLKNNinF83A6Hw6Jlgmg&s=10"
  },
  {
    "id": 4,
    "title": "24/7 Support",
    "description": "Our team is always here to help you.",
    "icon": "support",
    "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpH44Jxen1a7qqn4xYpw_A5OBcIEuqhWc9TKqBY9d4pA&s"
  }
]


export default function Why_AH() {
  return (
    <div className="py-10 px-4">
      <div className="TopCategories">
        <p className="Explore">Why Choose Us</p>
        <h2 className="Popular">Why Artist Hood?</h2>
      </div>

      <div className="flex flex-wrap justify-center gap-1">
        {feature_json.map((feature) => (
          <Feature_card key={feature.id} feature={feature} />
        ))}
      </div>
      <div className="style={margin-top:200px;} user_count_data flex justify-around  items-center mt-10 bg-gray-50">
        <User_count />
        <User_count />
        <User_count />
        <User_count />
      </div>
    </div>
  );
}

function Feature_card({ feature }) {
  return (
    <div className="app_features w-[70%] sm:w-[70%] md:w-[45%] lg:w-[40%] xl:w-[22%] flex border-2 justify-center items-center p-4 mb-9 h-30">
      <div className="img w-1/3 flex justify-center items-center">
        <img
          src={feature.src}
          alt={feature.title}
          className="w-16 h-16"
        />
      </div>

      <div className="feature_data w-2/3">
        <h3 className="font-bold">{feature.title}</h3>
        <p>{feature.description}</p>
      </div>
    </div>
  );
}


function User_count() {
  return (

    <div className="feature_data flex flex-col w-200 h-30 justify-center items-center m-10 border-l-1 border-grey-100 ">
      <h3 className="font-bold">500+</h3>
      <p>artist</p>
    </div>

  );
}