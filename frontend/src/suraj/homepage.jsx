import styles from "./HomePage.module.css";
import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode as a named import
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import axios from 'axios'; // Import axios for making API requests

const NewHomePage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [isVerified, setIsVerified] = useState('');
    const [profileImage, setProfileImage] = useState(''); // State to hold the profile image URL
    // const [uploadStatus, setUploadStatus] = useState(''); // For displaying upload status
    const [loading, setLoading] = useState(false); // Loading state
    const [userid, setUserid] = useState('');
    const [showProfile, setShowProfile] = useState(false);


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
                const response = await axios.post('https://online-voting-platform-4iqo.onrender.com/cloudinary/upload', formData, {
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

    const handleToggleProfile = () => {
        setShowProfile((prev) => !prev); // Toggle visibility
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.websiteTitle}>Online Voting Platform</div>
                <div className={styles.menu} onClick={handleToggleProfile}>
                    #
                </div>
                {showProfile && (
                    <div className={styles.profilePopup}>
                        <div className={styles.profile}>
                            <div className={styles.profileImageContainer}>
                                <div className={styles.profileImage} style={{ backgroundImage: `url(${profileImage})` }}></div>
                                <div className={styles.uploadImage}>
                                    <input
                                        type="file"
                                        id="fileInput"
                                        accept="image/*"
                                        style={{ display: 'none' }} // Hide the file input
                                        onChange={handleFileChange}
                                    />
                                    <button onClick={() => document.getElementById('fileInput').click()}
                                        disabled={loading}>{loading ? 'Uploading...' : 'Upload Image'} </button>
                                </div>
                            </div>
                            <div className={styles.otherDetailsContainer}>
                                <div className={styles.username}><span>Username: {username}</span></div>
                                <div className={styles.email}><span>Email: {email}</span></div>
                                <div className={styles.verification}><span>Verified: {isVerified}</span></div>
                                <div className={styles.role}><span>Role: {role}</span></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className={styles.navigationLinks}>
                <div className={styles.box1}>
                    {renderNavigationItem("allElection", "All Elections",handleRedirectAllElections)}
                    {renderNavigationItem("castVote", "Cast Vote",handleRedirectCastVote)}
                    {renderNavigationItem("latestResult", "Latest Result")}
                    {renderNavigationItem("beCandidate", "Be A Candidate")}
                    {renderNavigationItem("contactAdministrator", "Contact Administrator")}
                </div>
                <div className={styles.box2}>
                    {renderNavigationItem("electionsYouVoted", "Elections You Have Voted In")}
                    {renderNavigationItem("adminsList", "Admins List",handleRedirectAdminList)}
                    {role === "Admin" && renderNavigationItem("adminSpecial", "Admin Special", handleRedirectAdminSpecial)}
                    {renderNavigationItem("aboutUs", "About Us")}
                    {renderNavigationItem("moreInfo", "More Info")}
                </div>
            </div>
        </div>
    );
};

const renderNavigationItem = (className, title, handleClick) => {
    return (
        <div className={`${styles.size} ${styles[className]}`} onClick={handleClick}>
            <div className={`${styles.image} ${styles[`${className}Img`]}`}></div>
            <div className={styles.title}><span>{title}</span></div>
        </div>
    );
};

export default NewHomePage;
