import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode as a named import
import homeStyles from './home.module.css'; // Import the CSS module
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import axios from 'axios'; // Import axios for making API requests
import votebanner from "./voteBanner.png";

const HomePage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [isVerified, setIsVerified] = useState('');
  const [profileImage, setProfileImage] = useState(''); // State to hold the profile image URL
  // const [uploadStatus, setUploadStatus] = useState(''); // For displaying upload status
  const [loading, setLoading] = useState(false); // Loading state
  const [userid, setUserid] = useState('');

  const navigate = useNavigate(); // Initialize useNavigate hook

  // Function to extract user details from the JWT token
  const extractUserDetailsFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setProfileImage(decodedToken.profile);
        setUserid(decodedToken.id);
        setUsername(decodedToken.username);
        setEmail(decodedToken.email);
        setRole(decodedToken.role);
        setIsVerified(decodedToken.isVerified ? 'Yes' : 'No');
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  };

  useEffect(() => {
    extractUserDetailsFromToken();
  }, []);

  // Handle file change and upload image
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const userId = userid; // Assuming you store userId in localStorage

    if (file && file.type.startsWith('image/')) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId); // Append userId to formData

      setLoading(true); // Set loading to true when the upload starts
      try {
        const response = await axios.post('http://localhost:8000/cloudinary/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setProfileImage(response.data.url); // Set the uploaded image URL
        // setUploadStatus('Profile image uploaded successfully!');
      } catch (error) {
        console.error('Error uploading file:', error);
        // setUploadStatus('Failed to upload profile image.');
      } finally {
        setLoading(false); // Set loading to false when the upload ends
      }
    } else {
      // setUploadStatus('Please select a valid image file.');
    }
  };

  const handleRedirectAdminSpecial = () => {
    navigate('/home/admin');
  };
  const handleRedirectCastVote = () => {
    navigate('/home/castVote');
  };
  const handleRedirectAllElections = () => {
    navigate('/home/allElections');
  };
  const handleRedirectAdminList = () => {
    navigate('/home/adminList');
  };

  return (
    <div className={homeStyles.homeBody}>
      <div className={homeStyles.container}>
        <div className={homeStyles.left}>
          <div className={homeStyles.profile}>
            <div className={homeStyles.pageTitle}>
              <span>Online Voting Platform</span>
            </div>
            <div className={homeStyles.ypd}>
              <span>-- Your Profile Details --</span>
            </div>

            {/* Profile Image Upload Section */}
            <div className={homeStyles.profileImageContainer}>
              <div
                className={homeStyles.profileImage}
                style={{ backgroundImage: `url(${profileImage})` }}
              />
            </div>
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              style={{ display: 'none' }} // Hide the file input
              onChange={handleFileChange}
            />
            <button
              className={homeStyles.uploadButton}
              onClick={() => document.getElementById('fileInput').click()}
              disabled={loading} // Disable button while loading
            >
              {loading ? 'Uploading...' : 'Upload Profile Image'} {/* Conditional button text */}
            </button>
            {/* {uploadStatus && <div className={homeStyles.uploadStatus}>{uploadStatus}</div>} Display upload status */}

            {/* User Details Section */}
            <div className={homeStyles.usernameContainer}>
              <div className={homeStyles.username}>
                <span>{username}</span>
              </div>
            </div>
            <div className={homeStyles.emailContainer}>
              <div className={homeStyles.email}>
                <span>{email}</span>
              </div>
            </div>
            <div className={homeStyles.roleContainer}>
              <div className={homeStyles.role}>
                <span>Role: {role}</span>
              </div>
            </div>
            <div className={homeStyles.verifyContainer}>
              <div className={homeStyles.verify}>
                <span>Verified: {isVerified}</span>
              </div>
            </div>
          </div>

          <div className={homeStyles.middle}>
            <div className={homeStyles.quote}>
              <h1>Cast Your Vote, Make an Impact—Your Choice Drives the Outcome!</h1>
            </div>

            <div className={homeStyles.activeElection} style={{ backgroundImage: `url(${votebanner})` }} />
          </div>
        </div>

        <div className={homeStyles.right}>
          <div className={homeStyles.rightHeader}>
            <span>Important Links</span>
          </div>
          <div className={homeStyles.boxes} onClick={handleRedirectAllElections}>
            <span>All Elections</span>
          </div>
          <div className={homeStyles.boxes}>
            <span>Latest Elections Results</span>
          </div>
          <div className={homeStyles.boxes}>
            <span>Be A Candidate</span>
          </div>
          <div className={homeStyles.boxes}>
            <span>Contact Administrator</span>
          </div>
          <div className={homeStyles.boxes}>
            <span>Elections You Have Voted In</span>
          </div>
          <div className={homeStyles.boxes} onClick={handleRedirectAdminList}>
            <span>Admins List</span>
          </div>
          {role === 'admin' && (
            <div className={homeStyles.boxes} onClick={handleRedirectAdminSpecial}>
              <span>Admin Special</span>
            </div>
          )}
          <div className={homeStyles.boxes} onClick={handleRedirectCastVote}>
            <span>Cast Vote</span>
          </div>
          <div className={homeStyles.boxes}>
            <span>About Us</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
