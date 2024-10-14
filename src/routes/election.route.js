import express from 'express';
import { createElection, getAllElections, getElectionById, deleteElection, getElectionsByUserId } from '../controllers/electionController.js';

const router = express.Router();

router.post('/create', createElection);
router.get('/all', getAllElections);
router.get('/:id', getElectionById);
// router.delete('/:electionId', deleteElection);
// router.get("/:userId", getElectionsByUserId)

export default router;
