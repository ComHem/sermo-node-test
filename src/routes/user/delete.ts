import express from 'express';
import {StatusCodes} from 'http-status-codes';
import {deleteUser as deleteDbUser} from '../../utils/database.js';

export const deleteUser = express.Router();

deleteUser.delete('/:id', async (req, res) => {
  /**
   * Params.
   */

  let {id = ''} = req.params;
  id = id.trim();

  /**
   * Delete user.
   */

  const error = await deleteDbUser(id);

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
