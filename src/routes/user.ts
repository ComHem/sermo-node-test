import express from 'express';
import {StatusCodes} from 'http-status-codes';

export const userRouter = express.Router();

userRouter.post('/user', async (req, res) => {
  res.status(StatusCodes.NO_CONTENT).end();
});
