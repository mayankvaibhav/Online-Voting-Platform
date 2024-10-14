import { Election } from '../models/Election.model.js';
import { Vote } from '../models/Vote.model.js';
import { User } from '../models/User.model.js'; // Import the User model
import { Candidate } from '../models/Candidate.model.js'; // Import the Candidate model to update vote count
import jwt from 'jsonwebtoken';

export const castVote = async (req, res) => {
  const { electionId, candidateId } = req.body;
  const token = req.headers.authorization?.split(' ')[1];  // Get the token from the Authorization header

  // Validate input
  if (!electionId || !candidateId) {
    console.log(req.body);
    return res.status(400).json({ message: 'Election ID and Candidate ID are required.' });
  }

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Extract the voter ID from the token
    const { id: voterId } = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Voter ID:", voterId);
    console.log("Election ID:", electionId);
    console.log("Candidate ID:", candidateId);

    // Check if the election is active
    const election = await Election.findById(electionId);
    if (!election || election.status !== true) {
      return res.status(400).json({ message: 'Election is not active.' });
    }

    // Check if the voter has already voted in this election
    const existingVote = await Vote.findOne({ voter: voterId, election: electionId });
    if (existingVote) {
      return res.status(400).json({ message: 'You have already voted in this election.' });
    }

    // Create and save the new vote
    const newVote = new Vote({
      voter: voterId,
      election: electionId,
      candidate: candidateId
    });

    await newVote.save();

    // Update the user's votedInElection field
    await User.findByIdAndUpdate(
      voterId,
      { $addToSet: { votedInElection: electionId } }, // Use $addToSet to avoid duplicates
      { new: true } // Return the updated user document
    );

    // Increment the votesCount of the candidate
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      candidateId,
      { $inc: { votesCount: 1 } },  // Increment votesCount by 1
      { new: true } // Return the updated candidate document
    );

    res.status(200).json({ 
      message: 'Vote cast successfully!',
      vote: newVote,
      candidate: updatedCandidate // Return updated candidate with new vote count
    });
  } catch (error) {
    console.error('Error casting vote:', error);
    res.status(500).json({ message: 'Error casting vote', error: error.message });
  }
};
