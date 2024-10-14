import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode as a named import
import './home.css'; // Import the CSS for styling

const Home = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [isVerified, setIsVerified] = useState('');

  // Function to extract username from the JWT token
  const extractUsernameFromToken = () => {
    // Get the token from LocalStorage
    const token = localStorage.getItem('token');

    if (token) {
      try {
        // Decode the token to get the payload
        const decodedToken = jwtDecode(token); // Use the named import `jwtDecode`


        // Extract the username from the token
        setUsername(decodedToken.username); // Assuming the token has a `username` field
        setEmail(decodedToken.email)
        setRole(decodedToken.role)
        if (decodedToken.isVerified) {
          setIsVerified("Yes")
        }
        else {
          setIsVerified("No")
        }

      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  };

  // Use useEffect to extract the username when the component loads
  useEffect(() => {
    extractUsernameFromToken();
  }, []);

  return (
    <div className='homeBody'>
      <div class="container">
        <div class="left">
          <div class="profile">
            <div class="pageTitle">
              <span>Online Voting Platform</span>
            </div>
            <div class="ypd">
              <span>-- Your Profile Details --</span>
            </div>
            <div class="profileImageContainer">
              <div class="profileImage"></div>
            </div>
            <div class="usernameContainer">
              <div class="username">
                <span>{username}</span>
              </div>
            </div>
            <div class="emailContainer">
              <div class="email">
                <span>{email}</span>
              </div>
            </div>
            <div class="roleContainer">
              <div class="role">
                <span>Role: {role} </span>
              </div>
            </div>
            <div class="verifyContainer">
              <div class="verify">
                <span>Verified: {isVerified} </span>
              </div>
            </div>
          </div>
          <div class="middle">
            <div class="quote">
              <h1>Cast Your Vote, Make an Impact—Your Choice Drives the Outcome!</h1>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="right-header"></div>
          <div class="boxes"></div>
          <div class="boxes"></div>
          <div class="boxes"></div>
          <div class="boxes"></div>
          <div class="boxes"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
