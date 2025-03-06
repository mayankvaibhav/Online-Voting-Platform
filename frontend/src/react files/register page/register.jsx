import React, { useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import registerStyles from './register.module.css';
import skaterGirl from "./Skater Girl.png";

const Register = () => {
  // State to store username, email, password, and registration status
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Function to handle form submission
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit

    try {
      // Send POST request to backend with registration credentials
      const response = await Axios.post('https://online-voting-platform-4iqo.onrender.com/users/register', {
        username,
        email,
        password
      });

      const data = response.data;

      // Handle successful registration
      if (data.message === "User registered successfully") {
        // Alert success message
        alert(`You registered successfully, ${username}. Now you can "LOG IN"!`);
        
        // Redirect to login page after successful registration
        navigate('/login');
      } else {
        alert('Error registering user');
      }
    } catch (error) {
      alert('An error occurred. Please try again later.');
    }
  };

  // Function to handle Signin link click
  const handleSigninClick = (e) => {
    e.preventDefault(); // Prevent default link behavior
    navigate('/login'); // Navigate to the login page
  };

  return (
    <div className={registerStyles.RegisterPage}>
      <div className={registerStyles.ParentContainer}>
        <div className={registerStyles.FormContainer}>
          <div className={registerStyles.Nothing}></div>
          <form className={registerStyles.Form} onSubmit={handleRegister}>
            <p className={registerStyles.Title}>Register</p>
            <p className={registerStyles.Message}>Signup now and get full access to our app.</p>
            <label>
              <input
                className={registerStyles.Input}
                type="text"
                placeholder=""
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <span>Username</span>
            </label>
            <label>
              <input
                className={registerStyles.Input}
                type="email"
                placeholder=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <span>Email</span>
            </label>
            <label>
              <input
                className={registerStyles.Input}
                type="password"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span>Password</span>
            </label>
            <button className={registerStyles.Submit} type="submit">Submit</button>
            <p className={registerStyles.Signin}>
              Already have an account? <a href="#" onClick={handleSigninClick}>Signin</a>
            </p>
          </form>
          <div className={registerStyles.Nothing}></div>
        </div>
        <div className={registerStyles.ContentContainer}>
          <div className={registerStyles.SloganParagraph}>
            <div className={registerStyles.Slogan}>
              <h1>Your Next Big Step Begins Here</h1>
              <h1>Register Now!</h1>
            </div>
            <div className={registerStyles.Paragraph}>
              <p>
                Our online voting platform offers a secure, hassle-free experience, allowing you to vote anytime, anywhere.
                With advanced security and an intuitive interface, we make voting easy and accessible. Empower your voice
                and participate confidently, knowing your vote is protected at every step.
              </p>
            </div>
          </div>
          <div className={registerStyles.Image}>
            <img src={skaterGirl} alt="Skater Girl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
