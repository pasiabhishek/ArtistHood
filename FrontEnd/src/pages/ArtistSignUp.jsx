import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./css/Auth.css";
import useTitle from "./UseTitle";
import artistCategories from "../data/artistCategories";

const initialForm = {
  // Keep every field in one object so the form can be submitted as one profile.
  stageName: "",
  category: "",
  bio: "",
  city: "",
  state: "",
  experience: "",
  price: "",
  priceType: "per event",
  instagram: "",
  youtube: "",
  website: "",
  availability: "",
  terms: false,
};

export default function ArtistSignUp() {
  useTitle("Artist Sign Up");
  const [formData, setFormData] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const updateField = (event) => {
    // The same handler supports text inputs, selects, textareas, and checkboxes.
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // This is temporary client-side storage until the artist API is connected.
    localStorage.setItem("artistApplication", JSON.stringify(formData));
    setSubmitted(true);
  };

  return (
    <main className="auth-page artist-signup-page">
      <nav className="auth-nav">
        <Link className="logo" to="/" aria-label="ArtistHood home">
          ARTIST<span>HOOD</span>
        </Link>
        {/* <p>
          Already registered? <Link to="/login">Log in</Link>
        </p> */}
      </nav>
      <section
        className="artist-signup-content"
        aria-labelledby="artist-signup-heading"
      >
        <div className="auth-intro">
          <p className="auth-eyebrow">JOIN THE ARTISTHOOD NETWORK</p>
          <h1>Turn your talent into unforgettable events.</h1>
          <p>
            Build your profile once, get discovered by the right clients, and
            grow your bookings with ArtistHood.
          </p>
        </div>
        <div className="auth-card artist-signup-card">
          {/* Show a confirmation state after the local profile save succeeds. */}
          {submitted ? (
            <div className="artist-signup-success" role="status">
              <p className="auth-eyebrow">PROFILE SAVED</p>
              <h2>Your artist application is ready.</h2>
              <p>
                We have saved your details on this device. Connect the
                registration API to submit this profile to your artist network.
              </p>
              <Link
                className="auth-submit artist-signup-success-link"
                to="/login"
              >
                Continue to login
              </Link>
              <button
                className="artist-signup-reset"
                type="button"
                onClick={() => setSubmitted(false)}
              >
                Edit profile
              </button>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-card-heading">
                <h2 id="artist-signup-heading">Create your artist profile</h2>
                <p>Tell clients what you do and how they can book you.</p>
              </div>
              {/* Group related fields so a long profile remains easy to scan. */}
              <fieldset>
                <legend>Basic details</legend>
                
                <label>
                  Stage or professional name
                  <input
                    name="stageName"
                    value={formData.stageName}
                    onChange={updateField}
                    placeholder="The name clients will see"
                    required
                  />
                </label>
                <div className="auth-name-row">
{/*                  
                  <label>
                    Phone number
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={updateField}
                      autoComplete="tel"
                      required
                    />
                  </label> */}
                </div>
              </fieldset>
              <fieldset>
                <legend>Performance profile</legend>
                <label>
                  Primary category
                  <select
                    name="category"
                    value={formData.category}
                    onChange={updateField}
                    required
                  >
                    <option value="">Select your talent</option>
                    {artistCategories.map((category) => <option key={category}>{category}</option>)}
                  </select>
                </label>
                <label>
                  About your act
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={updateField}
                    placeholder="Describe your style, experience, and the events you perform at"
                    minLength="40"
                    maxLength="500"
                    required
                  />
                </label>
                <div className="auth-name-row">
                  <label>
                    Years of experience
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={updateField}
                      min="0"
                      max="80"
                      required
                    />
                  </label>
                  <label>
                    Available from
                    <input
                      type="date"
                      name="availability"
                      value={formData.availability}
                      onChange={updateField}
                      required
                    />
                  </label>
                </div>
              </fieldset>
              <fieldset>
                <legend>Location and pricing</legend>
                <div className="auth-name-row">
                  <label>
                    City
                    <input
                      name="city"
                      value={formData.city}
                      onChange={updateField}
                      autoComplete="address-level2"
                      required
                    />
                  </label>
                  <label>
                    State
                    <input
                      name="state"
                      value={formData.state}
                      onChange={updateField}
                      autoComplete="address-level1"
                      required
                    />
                  </label>
                </div>
                <div className="auth-name-row">
                  <label>
                    Starting price (INR)
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={updateField}
                      min="0"
                      placeholder="25000"
                      required
                    />
                  </label>
                  <label>
                    Price is quoted
                    <select
                      name="priceType"
                      value={formData.priceType}
                      onChange={updateField}
                    >
                      <option>per event</option>
                      <option>per hour</option>
                      <option>per day</option>
                    </select>
                  </label>
                </div>
              </fieldset>
              <fieldset>
                <legend>Online presence</legend>
                <label>
                  Instagram profile
                  <input
                    type="url"
                    name="instagram"
                    value={formData.instagram}
                    onChange={updateField}
                    placeholder="https://instagram.com/yourname"
                  />
                </label>
                <label>
                  YouTube or portfolio link
                  <input
                    type="url"
                    name="youtube"
                    value={formData.youtube}
                    onChange={updateField}
                    placeholder="https://youtube.com/@yourname"
                  />
                </label>
                <label>
                  Website <span className="optional-label">optional</span>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={updateField}
                    placeholder="https://yourwebsite.com"
                  />
                </label>
              </fieldset>
              <fieldset>
                <label className="auth-check">
                  <input
                    type="checkbox"
                    name="terms"
                    checked={formData.terms}
                    onChange={updateField}
                    required
                  />
                  {/* <span>
                    I agree to the ArtistHood Terms of Service and Privacy
                    Policy.
                  </span> */}
                </label>
              </fieldset>
              <button className="auth-submit" type="submit">
                Create artist profile
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
