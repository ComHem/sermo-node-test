import express from 'express';
import {StatusCodes} from 'http-status-codes';
import {deleteUser} from '../../utils/database.js';

export const deleteUserRoute = express.Router();

deleteUserRoute.delete('/user/:id', async (req, res) => {
  /**
   * Params.
   */

  let {id = ''} = req.params;
  id = id.trim();

  /**
   * Delete user.
   */

  const error = await deleteUser(id);

  if (error) {
    const status =
      error === 'NOT_FOUND'
        ? StatusCodes.NOT_FOUND
        : StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).end();
    return;
  }

  /**
   * Done.
   */

  res.status(StatusCodes.NO_CONTENT).end();
});
