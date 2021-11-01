import express from 'express';
import {StatusCodes} from 'http-status-codes';
import {ResolvedUser, User} from '../../types/user.js';
import {assertRequestType} from '../../utils/assertRequestType.js';
import {getUser, saveUser} from '../../utils/database.js';
import {getProfilePictureUrl} from '../../utils/getProfilePictureUrl.js';
import {getTopStarredRepositories} from '../../utils/getTopStarredRepositories.js';
import {validateEmail} from '../../utils/validators/validateEmail.js';

export const patchUser = express.Router();

interface ErrorBody {
  email?: string;
}

const validKeys = ['username', 'email'];

patchUser.patch('/:id', async (req, res) => {
  if (
    !assertRequestType(req, res, {
      accept: ['application/json'],
      contentType: ['application/json'],
    })
  ) {
    return;
  }

  /**
   * Params.
   */

  let {id = ''} = req.params;
  id = id.trim();

  /**
   * Validate input.
   */

  const invalidKeys = Object.keys(req.body).filter(
    (key) => !validKeys.includes(key),
  );

  if (invalidKeys.length) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send(
        `Cannot patch the following properties on a User: ${invalidKeys.join(
          ', ',
        )}`,
      );
    return;
  }

  let {username = '', email = ''} = req.body;

  username = username.trim();
  email = email.trim();

  // TODO: Validate string format of "username".

  const emailError = validateEmail(email, false);

  if (emailError) {
    const body: ErrorBody = {};
    if (emailError) body.email = emailError.message;
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(body);
    return;
  }

  /**
   * Check if user already exists.
   */

  const existingUser = await getUser(id);

  if (!existingUser) {
    res.status(StatusCodes.NOT_FOUND).end();
    return;
  }

  /**
   * Patch user.
   */

  const patchedUser: User = {...existingUser};

  if (username) patchedUser.username = username;
  if (email) patchedUser.email = email;

  await saveUser(patchedUser);

  /**
   * Return user.
   */

  const resolvedUser: ResolvedUser = {
    ...patchedUser,
    profilePictureUrl: getProfilePictureUrl(patchedUser.email),
    topStarredRepositories: await getTopStarredRepositories(
      patchedUser.username,
    ),
  };

  res.send(resolvedUser);
});
