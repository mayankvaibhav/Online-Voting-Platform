import React, { useState } from 'react';
import createElectionCreation from './electioncreation.module.css';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode as a named import

const ElectionCreation = () => {

    const [electionName, setElectionName] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        // Reset error and success messages
        setError('');
        setSuccess('');

        // Validate required fields
        if (!electionName || !startTime || !endTime) {
            setError('Please provide all required fields: election name, start time, and end time.');
            return;
        }

        // Retrieve and decode JWT token
        const token = localStorage.getItem('token'); // Adjust the key as needed
        let createdBy = '';

        if (token) {
            try {
                const decodedToken = jwtDecode(token); // Use jwtDecode here
                createdBy = decodedToken.id; // Adjust to use 'id' from your JWT structure
            } catch (error) {
                setError('Invalid token. Please log in again.');
                return;
            }
        } else {
            setError('No token found. Please log in.');
            return;
        }

        // Prepare the election data
        const electionData = {
            electionName,
            description,
            startTime,
            endTime,
            isPrivate,
            createdBy, // The decoded token provides the user ID
        };

        try {
            const response = await fetch('http://localhost:8000/elections/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Optionally include token in request headers
                },
                body: JSON.stringify(electionData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(data.message);
                // Optionally reset form fields
                setElectionName('');
                setDescription('');
                setStartTime('');
                setEndTime('');
                setIsPrivate(false);
            } else {
                setError(data.message || 'Error creating election.');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An unexpected error occurred. Please try again later.');
        }
    };


    return (
        <div className={createElectionCreation.createElection}>
            <span className={createElectionCreation.candidateTitle}>
                <h1>Create Election</h1>
            </span>
            <div className={createElectionCreation.createElectionContainer}>
                <form onSubmit={handleSubmit} className={createElectionCreation.inMiddle}>
                    <div className={createElectionCreation.electionContainer}>
                        <div className={createElectionCreation.electionContainerFit}>
                            <div className={createElectionCreation.electionStartContainer}>
                                <div className={createElectionCreation.electionPrivate}>
                                    <div className={createElectionCreation.electionName}>
                                        <span>
                                            <input
                                                type="text"
                                                placeholder="Election name"
                                                value={electionName}
                                                onChange={(e) => setElectionName(e.target.value)}
                                            />
                                        </span>
                                    </div>
                                    <div className={createElectionCreation.isPrivate}>
                                        <span>
                                            <input
                                                type="checkbox"
                                                checked={isPrivate}
                                                onChange={() => setIsPrivate(!isPrivate)}
                                            />{' '}
                                            private
                                        </span>
                                    </div>
                                </div>
                                <div className={createElectionCreation.startEnd}>
                                    <div className={createElectionCreation.startTime}>
                                        <span>
                                            Start time{' '}
                                            <input
                                                type="datetime-local"
                                                value={startTime}
                                                onChange={(e) => setStartTime(e.target.value)}
                                            />
                                        </span>
                                    </div>
                                    <div className={createElectionCreation.endTime}>
                                        <span>
                                            End Time{' '}
                                            <input
                                                type="datetime-local"
                                                value={endTime}
                                                onChange={(e) => setEndTime(e.target.value)}
                                            />
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={createElectionCreation.description}>
                                <textarea
                                    placeholder="Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>
                            <div className={createElectionCreation.createButton}>
                                <button type="submit">Create Now</button>
                            </div>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            {success && <p style={{ color: 'green' }}>{success}</p>}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ElectionCreation;
