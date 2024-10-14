import express from 'express';
import { castVote } from '../controllers/voteController.js';
import jwtMiddleware from '../middlewares/jwtMiddleware.js';

const router = express.Router();

router.post('/castVote', jwtMiddleware, castVote);


export default router;
