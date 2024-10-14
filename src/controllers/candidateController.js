import { Candidate } from '../models/Candidate.model.js';
import { Election } from '../models/Election.model.js'; // Assuming you might need to validate elections

// Create a new candidate
export const createCandidate = async (req, res) => {
    const { candidateName, bio, election, nickname, profile } = req.body; // Added 'profile' in the destructuring

    try {
        // Check if the election exists
        const electionExists = await Election.findById(election);
        if (!electionExists) {
            return res.status(404).json({ message: 'Election not found.' });
        }

        // Count how many candidates are already associated with this election
        const candidateCount = await Candidate.countDocuments({ election });

        // Check if the number of candidates is already 2
        if (candidateCount >= 2) {
            return res.status(400).json({ message: "Can't create more candidates for this election. Maximum of 2 candidates allowed." });
        }

        // Create a new candidate
        const newCandidate = new Candidate({
            candidateName,
            nickname, // Include nickname
            profile,  // Include profile
            bio,
            election,
        });

        // Save the new candidate
        await newCandidate.save();

        // Send success response
        res.status(201).json({ message: 'Candidate created successfully!', candidate: newCandidate });
    } catch (error) {
        console.error('Error creating candidate:', error);
        res.status(500).json({ message: 'Error creating candidate', error: error.message });
    }
};




// Get all candidates for a specific election
export const getCandidatesByElection = async (req, res) => {
    const { electionId } = req.params;

    try {
        const candidates = await Candidate.find({ election: electionId });

        if (!candidates.length) {
            return res.status(404).json({ message: 'No candidates found for this election.' });
        }

        res.status(200).json(candidates);
    } catch (error) {
        console.error('Error retrieving candidates:', error);
        res.status(500).json({ message: 'Error retrieving candidates', error: error.message });
    }
};

// Get a candidate by ID
export const getCandidateById = async (req, res) => {
    const { id } = req.params;

    try {
        const candidate = await Candidate.findById(id);

        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found.' });
        }

        res.status(200).json(candidate);
    } catch (error) {
        console.error('Error retrieving candidate:', error);
        res.status(500).json({ message: 'Error retrieving candidate', error: error.message });
    }
};
