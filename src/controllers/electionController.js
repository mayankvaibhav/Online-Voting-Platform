import { Election } from '../models/Election.model.js';
import { Vote } from '../models/Vote.model.js';
import { Result } from '../models/Result.model.js';

import mongoose from 'mongoose';


// Create a new election
export const createElection = async (req, res) => {
  const { electionName, description, startTime, endTime, isPrivate, createdBy } = req.body;

  try {
    const newElection = new Election({
      electionName,
      description, // Array of candidate IDs
      startTime,
      endTime,
      isPrivate,
      createdBy

    });

    await newElection.save();

    res.status(201).json({
      message: 'Election created successfully',
      election: newElection
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating election',
      error
    });
  }
};

// Get all elections
export const getAllElections = async (req, res) => {
  try {
    const elections = await Election.find();
    res.status(200).json(elections);
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving elections',
      error
    });
  }
};

// Get a single election by ID
export const getElectionById = async (req, res) => {
  console.log("Request parameters:", req.params); // Log the parameters

  const { id } = req.params; // Change _Id to id

  try {
    console.log("Fetching election with ID:", id);

    const election = await Election.findById(id); // Use the correct variable name

    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    res.status(200).json(election);
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving election',
      error: error.message // Optional: send a more specific error message
    });
  }
};



// Delete an election
export const deleteElection = async (req, res) => {
  const { electionId } = req.params;

  try {
    const election = await Election.findByIdAndDelete(electionId);

    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // Optionally delete related votes and results
    await Vote.deleteMany({ election: electionId });
    await Result.deleteMany({ election: electionId });

    res.status(200).json({ message: 'Election and related data deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting election',
      error
    });
  }
};


export const getElectionsByUserId = async (req, res) => {
  const { userId } = req.params; // Assuming userId is passed as a URL parameter

  try {
      // Check if userId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ error: "Invalid User ID" });
      }

      // Find all elections created by the user
      const elections = await Election.find({ createdBy: userId });

      // Check if elections are found
      if (!elections || elections.length === 0) {
          return res.status(404).json({ message: "No elections found for this user" });
      }

      // Return the list of elections
      return res.status(200).json(elections);

  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
  }
};

import cron from "node-cron";

// Function to check and update election status
const updateElectionStatus = async () => {
  try {
    // Get the current time
    const currentTime = new Date();

    // Find elections where the current time is between startTime and endTime
    const ongoingElections = await Election.updateMany(
      { startTime: { $lte: currentTime }, endTime: { $gte: currentTime }, status: false },
      { $set: { status: true } }
    );

    // Find elections where the current time is past the endTime and mark them as inactive
    const endedElections = await Election.updateMany(
      { endTime: { $lt: currentTime }, status: true },
      { $set: { status: false } }
    );

    console.log("Election statuses updated.");
  } catch (err) {
    console.error("Error updating election statuses: ", err);
  }
};

// Schedule the task to run every minute
cron.schedule("* * * * *", () => {
  console.log("Checking and updating election statuses...");
  updateElectionStatus();
});

