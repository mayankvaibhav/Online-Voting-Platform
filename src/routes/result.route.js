import express from 'express';
import {calculateElectionResult} from "../controllers/resultController.js"

const resultRouter = express.Router();


resultRouter.get('/:electionId', calculateElectionResult);

export default resultRouter;