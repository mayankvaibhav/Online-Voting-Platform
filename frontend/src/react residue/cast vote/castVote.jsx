import React, { useState, useEffect } from "react";
import axios from "axios";
import castVoteStyle from "./castVote.module.css";
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode as a named import

const CastVote = () => {
    const [elections, setElections] = useState([]); // Store filtered elections
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [userId, setUserId] = useState("");
    const [token, setToken] = useState('');
    // const [displayData, setDisplayData] = useState('');

    // Fetch all elections and their candidates dynamically
    useEffect(() => {
        const fetchElectionData = async () => {
            try {
                // Fetch all elections
                const electionResponse = await axios.get(`http://localhost:8000/elections/all`);

                // Get current time
                const currentTime = new Date();

                // Filter elections that have started and whose status is true
                const filteredElections = electionResponse.data.filter(
                    (election) =>
                        new Date(election.startTime) <= currentTime && election.status === true // Check if status is true
                );

                // Sort elections by start time in descending order (latest first)
                filteredElections.sort(
                    (a, b) => new Date(b.startTime) - new Date(a.startTime)
                );

                // Fetch candidates for each filtered election
                const electionsWithCandidates = await Promise.all(
                    filteredElections.map(async (election) => {
                        const candidatesResponse = await axios.get(`http://localhost:8000/candidate/${election._id}`);
                        return { ...election, candidates: candidatesResponse.data || [] }; // Ensure candidates is an array
                    })
                );

                // Filter to only include elections with exactly two candidates
                const electionsWithTwoCandidates = electionsWithCandidates.filter(
                    (election) => election.candidates.length === 2
                );

                setElections(electionsWithTwoCandidates); // Set the filtered elections with their candidates
            } catch (err) {
                setError('Failed to load elections and candidates');
            } finally {
                setLoading(false);
            }
        };

        fetchElectionData();
    }, []);


    // Function to extract user details from the JWT token
    const extractUserIdFromToken = () => {
        const token = localStorage.getItem('token');
        setToken(token);

        if (token) {
            try {
                const decodedToken = jwtDecode(token); // Use the named import `jwtDecode`
                setUserId(decodedToken.id); // Assuming the token has a `username` field
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    };

    useEffect(() => {
        extractUserIdFromToken();
    }, []);

    const handleClick = async (event) => {
        const data = event.target.getAttribute('data-info');
        // setDisplayData(data); // Update the state to display the data

        const cleanedData = data.replace(/[\[\]]/g, '');
        const array = cleanedData.split(',').map(item => item.trim());

        if (array.length < 3) {
            console.error('Invalid data format. Expected userId, electionId, candidateId.');
            return;
        }

        const voteData = {
            electionId: array[1],  // Election ID
            candidateId: array[2]  // Candidate ID
        };

        try {
            const response = await axios.post('http://localhost:8000/votes/castVote', voteData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Vote cast successfully:', response.data);
        } catch (error) {
            const errorMessage = error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : 'An error occurred while casting your vote.';

            console.error('Error casting vote:', errorMessage);
            alert(errorMessage); // Notify the user of the error
        }
    };

    if (loading) return <p>Loading elections and candidates...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            {/* Header */}
            <div className={castVoteStyle.header}>
                <a className={castVoteStyle.nav}>HOME</a>
            </div>

            {/* Banner */}
            <div className={castVoteStyle.banner}></div>

            <span className={castVoteStyle.voterTitle}>
                <h1>Choose Future</h1>
            </span>

            {elections.map((election) => (
                <div key={election._id} className={castVoteStyle.createCandidateContainer}>
                    <div className={castVoteStyle.nothing}></div>

                    {/* Election Details */}
                    <div className={castVoteStyle.electionDetailsContainer}>
                        <div className={castVoteStyle.electionTitle}>
                            <span>{election.electionName.toUpperCase()}</span>
                        </div>

                        <div className={castVoteStyle.electionDetails}>
                            <div className={castVoteStyle.startEndTime}>
                                <span>Start Time: {new Date(election.startTime).toLocaleTimeString()}</span>
                                <span> | </span>
                                <span>End Time: {new Date(election.endTime).toLocaleTimeString()}</span>
                            </div>
                            <div className={castVoteStyle.createdBy}>
                                <span>Created By: {election.createdBy.name}</span>
                            </div>
                        </div>
                    </div>

                    {/* Candidate Box */}
                    <div className={castVoteStyle.candidateBox}>
                        {Array.isArray(election.candidates) && election.candidates.map((candidate) => (
                            <div key={candidate._id} className={castVoteStyle.candidate1}>
                                <div className={castVoteStyle.createCandidate}>
                                    <div className={castVoteStyle.nothing}></div>

                                    <div className={castVoteStyle.profileNameContainer}>
                                        <div className={castVoteStyle.profileName}>
                                            <div className={castVoteStyle.profile} style={{ backgroundImage: `url(${candidate.profile})` }}></div>
                                            <div className={castVoteStyle.name}>
                                                <span>{candidate.candidateName}</span>
                                                {candidate.nickname && <span>({candidate.nickname})</span>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={castVoteStyle.bio}>
                                        <div className={castVoteStyle.bioContent}>
                                            <p>{candidate.bio}</p>
                                        </div>
                                    </div>

                                    <div className={castVoteStyle.voteContainer}>
                                        <button onClick={handleClick} className={castVoteStyle.vote} data-info={`${userId},${election._id},${candidate._id}`}>Vote</button>
                                    </div>

                                    <div className={castVoteStyle.nothing}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Election Description */}
                    <div className={castVoteStyle.elctionDescription}>
                        <div className={castVoteStyle.heading}>Election Description</div>
                        <div className={castVoteStyle.description}>
                            <p>{election.description}</p>
                        </div>
                    </div>

                    <div className={castVoteStyle.nothing}></div>
                </div>
            ))}
        </div>
    );
};

export default CastVote;
