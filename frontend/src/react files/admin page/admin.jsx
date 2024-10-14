import React, { useState } from 'react';
import adminStyles from './admin.module.css'; // Importing CSS as adminStyles

import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

import axios from 'axios';


const Admin = () => {
    // State variables for candidate creation
    const [candidateName, setCandidateName] = useState('');
    const [profile, setProfile] = useState('');
    const [bio, setBio] = useState('');
    const [electionId, setElectionId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [electionTitle, setElectionTitle] = useState(''); // State for election title

    const navigate = useNavigate(); // Initialize useNavigate hook



    // State to hold the profile image URL
    const [profileImage, setProfileImage] = useState('');
    const [uploadStatus, setUploadStatus] = useState(''); // For displaying upload status

    // Handle file change and upload image
    const handleFileChange = async (event) => {
        const file = event.target.files[0];

        if (file && file.type.startsWith('image/')) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                // Update the URL to point to your correct backend route
                const response = await axios.post('http://localhost:8000/uploadImage/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.data.url) {
                    setProfileImage(response.data.url); // Set the uploaded image URL
                    setUploadStatus('Profile image uploaded successfully!');
                } else {
                    setUploadStatus('Error occurred while uploading.');
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                setUploadStatus('Failed to upload profile image.');
            }
        } else {
            setUploadStatus('Please select a valid image file.');
        }
    };











    const handleElectionIdChange = async (e) => {
        const id = e.target.value;
        setElectionId(id);
        console.log(id)

        if (id) {
            try {
                const response = await fetch(`http://localhost:8000/elections/${id}`); // Fetch election title by ID

                if (!response.ok) {
                    throw new Error('Election not found');
                }

                const data = await response.json();
                setElectionTitle(data.electionName); // Update election title state
            } catch (err) {
                setElectionTitle(''); // Reset title if there was an error
                setError(err.message);
            }
        } else {
            setElectionTitle(''); // Reset title if input is cleared
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        

        // Prepare the candidate data, ensuring 'nickname' is only added if provided
        const candidateData = {
            candidateName,
            profile: profileImage, // Keep 'profile' field
            bio,
            election: electionId,
        };

        // Conditionally add 'nickname' if the profile (nickname) is not empty
        if (profile.trim()) {
            candidateData.nickname = profile;
        }

        try {  
            setLoading(true); // Set loading to true before making the request

            const response = await fetch('http://localhost:8000/candidate/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(candidateData),
            });

            // Parse the response data
            const data = await response.json();


            if (response.ok) {
                // If the response is successful (status code 200-299)
                setSuccess('Candidate created successfully!');

                // Clear the form fields
                setCandidateName('');
                setProfile('');
                setBio('');
                setElectionId('');
                setElectionTitle(''); // Clear election title

                alert('Candidate created successfully!');
            } else {
                // Handle specific errors based on the response status
                switch (response.status) {
                    case 400:
                        setError(data.message || 'Invalid data provided.');
                        alert(`Error 400: ${data.message || 'Invalid data provided.'}`);
                        break;
                    case 404:
                        setError(data.message || 'Election not found.');
                        alert(`Error 404: ${data.message || 'Election not found.'}`);
                        break;
                    case 500:
                        setError(data.message || 'Server error. Please try again later.');
                        alert(`Error 500: ${data.message || 'Server error. Please try again later.'}`);
                        break;
                    default:
                        setError('An unexpected error occurred.');
                        alert(`Unexpected error: ${data.message || 'An unexpected error occurred.'}`);
                        break;
                }
            }
        } catch (err) {
            // Handle network or other unexpected errors
            setError('Something went wrong. Please try again.');
            alert('Network or other error: Something went wrong. Please try again.');
        } finally {
            setLoading(false); // Set loading to false after request completion
        }



    };



    const handleRedirectElectionCreation = () => {
        navigate('/home/admin/createElection'); // Redirect to the register page
    };

    const handleRedirectElectionDetails = () => {
        navigate('/home/admin/electionsByAdmin'); // Redirect to the register page
    };


    return (
        <div className={adminStyles.adminBody}>
            <div className={adminStyles.header}>
                <nav className={adminStyles.nav}>
                    <a className={adminStyles.a} href="#">HOME</a>
                </nav>
            </div>
            <div className={adminStyles.banner}></div>
            <div className={adminStyles.creation}>
                <button className={adminStyles.candidateCreation}>Candidate Creation</button>
                <button className={adminStyles.electionCreation} onClick={handleRedirectElectionCreation}>Election Creation</button>
                <button className={adminStyles.electionDetail} onClick={handleRedirectElectionDetails}>Election Detail</button>
            </div>
            <span className={adminStyles.candidateTitle}>
                <h1>Create Candidate</h1>
            </span>
            <div className={adminStyles.createCandidateContainer}>
                <div className={adminStyles.nothing}></div>
                <div className={adminStyles.candidateContainer}>
                    <form className={adminStyles.createCandidate} onSubmit={handleSubmit}>
                        <div className={adminStyles.profileNameContainer}>
                            <div className={adminStyles.profile} style={{ backgroundImage: `url(${profileImage})` }}></div>
                            <input
                                type="file"
                                id="fileInput"
                                accept="image/*"
                                style={{ display: 'none' }} // Hide the file input
                                onChange={handleFileChange}
                            />
                            <button
                                type="button" // Ensure the button is of type 'button'
                                className={adminStyles.uploadButton}
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent default behavior, just in case
                                    document.getElementById('fileInput').click();
                                }}
                            >
                                Upload Profile Image
                            </button>

                            {uploadStatus && <p>{uploadStatus}</p>}
                            <div className={adminStyles.nameElectionIdContainer}>
                                <div className={adminStyles.name}>
                                    <label>
                                        <input
                                            type="text"
                                            placeholder="Candidate Name"
                                            value={candidateName}
                                            onChange={(e) => setCandidateName(e.target.value)}
                                        />
                                    </label>
                                </div>
                                <div className={adminStyles.nickname}>
                                    <label>
                                        <input
                                            type="text"
                                            placeholder="Nickname"
                                            value={profile}
                                            onChange={(e) => setProfile(e.target.value)}
                                        />
                                    </label>
                                </div>
                                <div className={adminStyles.electionId}>
                                    <label>
                                        <input
                                            type="text"
                                            placeholder="Election ID"
                                            value={electionId}
                                            onChange={handleElectionIdChange} // Change handler for Election ID
                                        />
                                    </label>
                                </div>
                                <div className={adminStyles.electionName}>
                                    <span className={adminStyles.PE}>{electionTitle || <span style={{ color: 'red' }}>{error}</span>}</span>
                                </div>
                            </div>
                        </div>
                        <div className={adminStyles.bio}>
                            <label>
                                <textarea
                                    cols="30"
                                    rows="10"
                                    placeholder="Enter biography here..."
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                ></textarea>
                            </label>
                        </div>
                        <div className={adminStyles.createNowContainer}>
                            <button type="submit" className={adminStyles.createNow} disabled={loading}>
                                {loading ? 'Creating...' : 'Create Now'}
                            </button>
                        </div>
                        {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
                        {success && <p style={{ color: 'green' }}>{success}</p>}
                        <div className={adminStyles.nothing}></div>
                    </form>
                </div>
                <div className={adminStyles.nothing}></div>
            </div>
        </div>
    );
};

export default Admin;
