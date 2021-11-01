import express from 'express';
import {deleteUser} from './delete.js';
import {getUser} from './get.js';
import {patchUser} from './patch.js';
import {postUser} from './post.js';

export const user = express.Router();

user.use('/', postUser);
user.use('/', getUser);
user.use('/', patchUser);
user.use('/', deleteUser);
