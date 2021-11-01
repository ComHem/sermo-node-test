import express from 'express';
import {user} from './user/index.js';

export const routes = express.Router();

routes.use('/user', user);
