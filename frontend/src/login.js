import React, { useState } from "react";
import Axios from "axios";
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

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
      const response = await Axios.post('https://online-voting-platform-4iqo.onrender.com/users/login', {
        username,
        password,
      });

      const data = response.data;

      console.log(data.message); // Log the backend message for debugging

      // Handle successful login
      if (data.message === "Login successful") {
        // Store the JWT token in LocalStorage
        localStorage.setItem('token', data.token);

        // Optionally, store user information
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect to home page after successful login
        navigate('/login/home');
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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <div>{loginStatus}</div>
      <div>
        <button onClick={handleRedirectToRegister}>Register</button>
      </div>
    </div>
  );
};

export default Login;

