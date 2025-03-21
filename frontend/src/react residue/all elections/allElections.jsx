import React, { useEffect, useState } from "react";
import axios from "axios";
import allElectionStyles from "./allElections.module.css";

const AllElections = () => {
    const [elections, setElections] = useState([]);

    // Fetch all elections
    const fetchElections = async () => {
        try {
            const res = await axios.get("https://online-voting-platform-4iqo.onrender.com/elections/all"); // Adjust the API endpoint if needed
            setElections(res.data);
        } catch (error) {
            console.error("Error fetching elections", error);
        }
    };

    useEffect(() => {
        fetchElections();
    }, []);

    // Filter out past elections (whose endTime is before the current date)
    const currentDate = new Date();
    const pastElections = elections.filter(election => new Date(election.endTime) < currentDate);

    // Group past elections into chunks of three and sort latest first
    const groupedElections = pastElections
        .sort((a, b) => new Date(b.startTime) - new Date(a.startTime)) // Sort by start time, latest first
        .reduce((acc, election, index) => {
            if (index % 3 === 0) acc.push([]);
            acc[acc.length - 1].push(election);
            return acc;
        }, []);

    return (
        <div className={allElectionStyles.allElectionBody}>
            <div className={allElectionStyles.container}>
                <div className={allElectionStyles.header}>
                    <div className={allElectionStyles.websiteContent}>
                        <span>Online Voting Platform</span>
                    </div>
                    <div className={allElectionStyles.navigationLinks}>
                        <a href="/home">Home</a>
                    </div>
                </div>
                
                <div className={allElectionStyles.electionsListContainer}>
                    <div className={allElectionStyles.PE}>Past Elections</div>

                    {groupedElections.map((electionGroup, groupIndex) => (
                        <div key={groupIndex} className={allElectionStyles.electionBoxesContainer}>
                            {electionGroup.map((election) => (
                                <ElectionBox key={election._id} election={election} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ElectionBox component to handle each election's candidates and voting details
const ElectionBox = ({ election }) => {
    const [candidates, setCandidates] = useState([]);
    const [totalVotes, setTotalVotes] = useState(0);
    const [totalActiveTime, setTotalActiveTime] = useState(""); // State for total active time

    // Fetch candidates by election ID
    const fetchCandidates = async (electionId) => {
        try {
            const res = await axios.get(`https://online-voting-platform-4iqo.onrender.com/candidate/${electionId}`); // Adjust API endpoint
            return res.data;
        } catch (error) {
            console.error("Error fetching candidates", error);
        }
    };

    // Calculate total votes
    const calculateTotalVotes = (candidates) => {
        return candidates.reduce((total, candidate) => total + candidate.votesCount, 0);
    };

    // Calculate total active time
    const calculateActiveTime = (startTime, endTime) => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const activeTimeInHours = Math.abs(end - start) / 36e5; // Convert milliseconds to hours
        return activeTimeInHours.toFixed(2); // Return the active time rounded to 2 decimal places
    };

    useEffect(() => {
        const fetchAndSetCandidates = async () => {
            const fetchedCandidates = await fetchCandidates(election._id);
            if (fetchedCandidates) {
                setCandidates(fetchedCandidates);
                setTotalVotes(calculateTotalVotes(fetchedCandidates));  // Set the total votes
            }

            // Calculate total active time and set state
            setTotalActiveTime(calculateActiveTime(election.startTime, election.endTime));
        };

        fetchAndSetCandidates();
    }, [election._id, election.startTime, election.endTime]);

    return (
        <div className={allElectionStyles.electionBoxesContainer}>
            <div className={allElectionStyles.electionBoxContainer}>
                <div className={allElectionStyles.electionTitleContainer}>
                    <div className={allElectionStyles.electionTitle}>
                        <div>{election.electionName}</div>
                    </div>
                </div>

                <div className={allElectionStyles.candidateVsContainer}>
                    {candidates.map((candidate) => (
                        <div className={allElectionStyles.candidateContainer} key={candidate._id}>
                            <div className={allElectionStyles.candidate} style={{ backgroundImage: `url(${candidate.profile})` }}></div>
                            <div className={allElectionStyles.candidateName}>
                                <span style={{ color: "white" }}>{candidate.candidateName}</span>
                                <span style={{ color: "white" }}>{candidate.nickname ? `(${candidate.nickname})` : ""}</span>
                            </div>
                            <div className={allElectionStyles.voteCount}>
                                <span style={{ color: "white" }}>{candidate.votesCount}</span>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div style={{ paddingLeft: "20px" }}>
                    <div className={allElectionStyles.totalVotes}>
                        <span style={{ color: "white" }}>Total votes: {totalVotes}</span> {/* Display total votes */}
                    </div>

                    <div className={allElectionStyles.totalActiveTime}>
                        <span style={{ color: "white" }}>Total active time: {totalActiveTime} hours</span> {/* Display total active time */}
                    </div>
                </div>

                <div className={allElectionStyles.seperatorDesign}>
                    <div className={allElectionStyles.seperatorDesignBox}></div>
                </div>

                <div className={allElectionStyles.createdTimerContainer} style={{ paddingLeft: "20px" }}>
                    <div className={allElectionStyles.createdBy}>
                        <span style={{ color: "white" }}>Created By: {election.createdBy}</span>
                    </div>
                    <div className={allElectionStyles.timer}>
                        <div>
                            <span style={{ color: "white" }}>Started at: {new Date(election.startTime).toLocaleString()}</span>
                            <div style={{ color: "white" }}>Ended at: {new Date(election.endTime).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
                <div className={allElectionStyles.seeBioContainer}>
                </div>
            </div>
        </div>
    );
};

export default AllElections;
