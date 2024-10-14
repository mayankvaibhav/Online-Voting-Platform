import mongoose from 'mongoose';
import { Result } from "../models/Result.model.js";
import { Vote } from "../models/Vote.model.js";
import { Candidate } from "../models/Candidate.model.js";

// Function to calculate total votes and store result
export const calculateElectionResult = async (req, res) => {
  try {
    // Cast electionId to ObjectId correctly
    const electionId = new mongoose.Types.ObjectId(req.params.electionId);
    console.log("Election ID (ObjectId):", electionId);  // Debug Election ID

    // Count total votes for the election
    const totalVotes = await Vote.countDocuments({ election: electionId });
    console.log("Total Votes:", totalVotes);  // Check the total vote count

    if (totalVotes === 0) {
      return res.status(404).json({ message: "No votes found for this election" });
    }

    // Aggregate votes by all candidates
    const votesByCandidates = await Vote.aggregate([
      { $match: { election: electionId } },
      { $group: { _id: "$candidate", voteCount: { $sum: 1 } } },
      { $sort: { voteCount: -1 } }  // Sort by vote count in descending order
    ]);

    console.log("Votes by Candidates:", votesByCandidates);  // Check aggregation result

    if (votesByCandidates.length > 0) {
      const winnerId = votesByCandidates[0]._id;
      const winnerVoteCount = votesByCandidates[0].voteCount;  // Winner's vote count

      // Fetch details of candidates to include in the response
      const candidateDetails = await Candidate.find({ _id: { $in: votesByCandidates.map(v => v._id) } });

      // Combine vote counts with candidate details
      const candidatesWithVotes = candidateDetails.map(candidate => {
        const voteData = votesByCandidates.find(v => v._id.toString() === candidate._id.toString());
        return {
          candidateId: candidate._id,
          candidateName: candidate.name,
          voteCount: voteData ? voteData.voteCount : 0
        };
      });

      // Save the result in the database
      const newResult = new Result({
        election: electionId,
        winner: winnerId,
        totalVotes: totalVotes,
        winnerVotes: winnerVoteCount
      });

      await newResult.save();

      res.status(200).json({
        message: "Election result calculated successfully!",
        result: {
          election: electionId,
          winner: winnerId,
          totalVotes: totalVotes,
          winnerVotes: winnerVoteCount,
          candidates: candidatesWithVotes  // Including list of candidates with vote counts
        }
      });
    } else {
      res.status(404).json({ message: "No votes found for this election" });
    }
  } catch (error) {
    console.log("Error:", error);  // Debug the error
    res.status(500).json({ message: "Error calculating election result", error });
  }
};
