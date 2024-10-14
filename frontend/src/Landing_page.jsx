import React from "react";
import { useNavigate } from "react-router-dom";
import landingStyles from "./landing.module.css";
import image from "./image.png"; // Ensure the correct path to your image

const LandingPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook inside the component

  // Function to handle navigation on button click
  const handleGetStartedClick = () => {
    navigate('/login'); // Navigate to login page
  };

  return (
    <div className={landingStyles.landingBody}>
      <div className={landingStyles.container}>
        <div className={landingStyles.content}>
          <div className={landingStyles.h1}><h1>Welcome back!</h1></div>
          <p className={landingStyles.contentText}>
            We’re excited to have you here. To continue your journey and
            unlock exciting features, simply sign in with your account details. <br />
            Your adventure awaits, so enter your information and <br />
            dive right in—let’s explore together!
          </p>
          <div className={landingStyles.buttonContainer}>
            <button className={landingStyles.button} onClick={handleGetStartedClick}>
              Get Started
            </button>
          </div>
        </div>
        <div className={landingStyles.imageContainer}>
          <img className={landingStyles.image} src={image} alt="Room Relaxing" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
