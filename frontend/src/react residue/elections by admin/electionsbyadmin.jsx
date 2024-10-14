import React, { useEffect, useState } from 'react';
import electionsByAdmin from './electionsByAdmin.module.css'; // Importing the CSS module
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

const ElectionCreatedRegistered = () => {
    const [elections, setElections] = useState([]); // State to hold elections
    const [uniqueElectionIds, setUniqueElectionIds] = useState([]); // State to hold unique election IDs
    const [candidateData, setCandidateData] = useState({}); // State to hold candidate data by election ID
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch elections by the user
    const fetchElections = async () => {
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
        if (!token) {
            throw new Error('No token found in local storage');
        }

        try {
            // Decode the JWT to extract the user ID
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id; // Assuming the JWT contains 'id' field for user ID

            console.log(userId)

            // Fetch the elections created by the user
            const response = await fetch(`http://localhost:8000/elections/${userId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                    'Content-Type': 'application/json',
                },
            });

            console.log(response)

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json(); // Parse the JSON response
            const uniqueIds = [...new Set(data.map(election => election._id))]; // Get unique election IDs
            setElections(data); // Set the full elections data
            setUniqueElectionIds(uniqueIds); // Set only the unique IDs

            return uniqueIds; // Return the unique election IDs
        } catch (error) {
            console.error('Error fetching elections:', error);
            throw error;
        }
    };

    // Function to fetch candidates for each election ID
    const fetchCandidatesByElectionIds = async (electionIds) => {
        try {
            const promises = electionIds.map(async (electionId) => {
                const response = await axios.get(`http://localhost:8000/candidate/${electionId}`);
                return { electionId, candidates: response.data };
            });

            const results = await Promise.all(promises);
            const candidateData = results.reduce((acc, { electionId, candidates }) => {
                acc[electionId] = candidates.length > 0 ? candidates : 'No candidates found';
                return acc;
            }, {});

            setCandidateData(candidateData); // Store the fetched candidates in state
        } catch (error) {
            console.error('Error fetching candidates:', error);
        }
    };

    // Fetch elections on component mount and then fetch candidates
    useEffect(() => {
        const fetchData = async () => {
            try {
                const electionIds = await fetchElections(); // Fetch elections
                await fetchCandidatesByElectionIds(electionIds); // Fetch candidates for the fetched elections
            } catch (err) {
                setError('Failed to fetch data');
            } finally {
                setLoading(false); // Ensure loading is set to false
            }
        };

        fetchData(); // Call the async function to fetch elections and candidates
    }, []);

    // Loading and error states
    if (loading) return <div>Loading elections...</div>;
    if (error) return <div>{error}</div>;

    console.log(candidateData)

    return (
        <div className={electionsByAdmin.electionCreatedByAdminBody}>
            {elections.map((election) => (
                <div key={election._id} className={electionsByAdmin.container}>
                    <div className={electionsByAdmin.parentContainer}>
                        <div className={electionsByAdmin.nothing}></div>
                        <div className={electionsByAdmin.electionTitle}>
                            <span>{election.electionName}</span> {/* Display election name */}
                        </div>
                        <div className={electionsByAdmin.createdStart}>
                            <div className={electionsByAdmin.createdPrivate}>
                                <div className={electionsByAdmin.createdAt}>
                                    <time dateTime={election.createdAt}>
                                        <span>Created at: {new Date(election.createdAt).toLocaleDateString()} | {new Date(election.createdAt).toLocaleTimeString()}</span>
                                    </time>
                                </div>
                                <div className={electionsByAdmin.isPrivate}>
                                    <span>Status: {election.isPrivate ? 'Private' : 'Public'}</span>
                                </div>
                            </div>
                            <div className={electionsByAdmin.time}>
                                <div className={electionsByAdmin.startTime}>
                                    <span>Start time: {new Date(election.startTime).toLocaleDateString()} | {new Date(election.startTime).toLocaleTimeString()}</span>
                                </div>
                                <div className={electionsByAdmin.endTime}>
                                    <span>End time: {new Date(election.endTime).toLocaleDateString()} | {new Date(election.endTime).toLocaleTimeString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className={electionsByAdmin.seperatorContainer}>
                            <div className={electionsByAdmin.seperator}></div>
                        </div>
                        <div className={electionsByAdmin.registeredCandidatesContainer}>
                            <span>Registered Candidates for this election</span>
                            <div className={electionsByAdmin.registeredCandidate}>
                                {candidateData[election._id] && candidateData[election._id] !== 'No candidates found' ? (
                                    candidateData[election._id].map((candidate) => (
                                        <div key={candidate._id} className={electionsByAdmin.candidate}>
                                            <div className={electionsByAdmin.c1}>
                                                <div className={electionsByAdmin.profile}></div>
                                                <span>{candidate.candidateName}</span> {/* Candidate name */}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No registered candidates for this election.</p> // Handle no candidates
                                )}
                            </div>
                        </div>
                        <div className={electionsByAdmin.deleteElection}>
                            <button type="button" aria-label="Delete Election">Delete Election</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ElectionCreatedRegistered;
