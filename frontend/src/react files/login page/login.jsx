import React, { useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import styles from './login.module.css'; // Import the CSS Module
import image from "./Colored Composition.png"

const Login = () => {
  // State to store username, password, and login status
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Function to handle form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit

    try {
      // Send POST request to backend with login credentials using Axios
      const response = await Axios.post('http://localhost:8000/users/login', {
        username,
        password,
      });

      const data = response.data;

      // Handle successful login
      if (data.message === "Login successful") {
        // Store the JWT token in LocalStorage
        localStorage.setItem('token', data.token);

        // Optionally, store user information
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect to home page after successful login
        navigate('/home'); // Adjust the path as needed
      } else {
        // If credentials are incorrect, update loginStatus
        setLoginStatus('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      setLoginStatus('An error occurred. Please try again later.');
    }
  };

  // Function to redirect to the register page
  const handleRedirectToRegister = () => {
    navigate('/register'); // Redirect to the register page
  };

  return (
    <div className={styles.loginBody}>
      <div className={styles.formBodyContainer}>
        <div className={styles.formContainer}>
          <p className={styles.title}>Login</p>
          <form className={styles.form} onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder=""
                value={username}
                onChange={(e) => setUsername(e.target.value)} // Update state on input change
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update state on input change
                required
              />
            </div>
            <button type="submit" className={styles.sign}>Sign in</button>
          </form>
          <div>{loginStatus}</div>
          <p className={styles.signup}>
            Don't have an account? <button onClick={handleRedirectToRegister} className="">Sign up</button>
          </p>
        </div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.content}>
          <div className={styles.slogan}>
            <h1>Login Today, Shape Tomorrow!</h1>
          </div>
          <div className={styles.paragraph}>
            <p>
              Log in securely to your account and access the voting platform with ease. Enter your credentials
              to engage in the democratic process, knowing your information is protected. New here? Sign up
              now to make your voice heard!
            </p>
          </div>
        </div>
        <div className={styles.image}>
          <img src={image} alt=""/>
        </div>
      </div>
    </div>
  );
};

export default Login;
