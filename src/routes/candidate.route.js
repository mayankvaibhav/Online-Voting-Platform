import express from 'express';
import { createCandidate, getCandidatesByElection, getCandidateById } from '../controllers/candidateController.js';
const candidateRoute = express.Router();

candidateRoute.post("/create",createCandidate)
candidateRoute.get("/:electionId", getCandidatesByElection)
// candidateRoute.get("/:id", getCandidateById)

export default candidateRoute;
