import express from 'express';
import {StatusCodes} from 'http-status-codes';
import {ResolvedUser} from '../../types/user.js';
import {assertRequestType} from '../../utils/assertRequestType.js';
import {getUser} from '../../utils/database.js';
import {getProfilePictureUrl} from '../../utils/getProfilePictureUrl.js';
import {getTopStarredRepositories} from '../../utils/getTopStarredRepositories.js';

export const getUserRoute = express.Router();

getUserRoute.get('/user/:id', async (req, res) => {
  if (!assertRequestType(req, res, {accept: ['application/json']})) {
    return;
  }

  /**
   * Input.
   */

  let {id = ''} = req.params;
  id = id.trim();

  /**
   * Get user.
   */

  const existingUser = await getUser(id);

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
