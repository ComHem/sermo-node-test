import express from 'express';
import {StatusCodes} from 'http-status-codes';
import {ResolvedUser} from '../../types/user.js';
import {assertRequestType} from '../../utils/assertRequestType.js';
import {getUser as getDbUser} from '../../utils/database.js';
import {getProfilePictureUrl} from '../../utils/getProfilePictureUrl.js';
import {getTopStarredRepositories} from '../../utils/getTopStarredRepositories.js';

export const getUser = express.Router();

getUser.get('/:id', async (req, res) => {
  if (!assertRequestType(req, res, {accept: ['application/json']})) {
    return;
  }

  /**
   * Params.
   */

  let {id = ''} = req.params;
  id = id.trim();

  /**
   * Get user.
   */

  const existingUser = await getDbUser(id);

  if (!existingUser) {
    res.status(StatusCodes.NOT_FOUND).end();
    return;
  }

  /**
   * Return user.
   */

  const resolvedUser: ResolvedUser = {
    ...existingUser,
    profilePictureUrl: getProfilePictureUrl(existingUser.email),
    topStarredRepositories: await getTopStarredRepositories(
      existingUser.username,
    ),
  };

  res.send(resolvedUser);
});
