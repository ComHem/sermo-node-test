import supertest from 'supertest';
import {server} from '../../index.js';
import {StatusCodes} from 'http-status-codes';
import nock from 'nock';
import {Repo} from '../../utils/getTopStarredRepositories.js';
import {getUser, saveUser} from '../../utils/database.js';
import {ResolvedUser, User} from '../../types/user.js';

jest.mock('../../utils/database.js');
jest.mock('../../utils/log.js');

afterEach(() => {
  jest.resetAllMocks();
  if (!nock.isDone()) {
    console.log('Pending nock mocks:', nock.pendingMocks());
  }
  nock.cleanAll();
});

describe('Update (PATCH) User', () => {
  test('Success, with multiple properties', async () => {
    const repos: Repo[] = [
      {full_name: 'zero', stargazers_count: 0},
      {full_name: 'one', stargazers_count: 1},
      {full_name: 'two', stargazers_count: 2},
    ];
    nock('https://api.github.com')
      .get('/users/PatchedName/repos')
      .reply(200, repos);

    const existingUser: User = {
      id: 'kesu123',
      username: 'KennethSundqvist',
      email: 'kenneth@kesu.se',
    };

    (getUser as unknown as jest.Mock).mockReturnValue(existingUser);

    const res = await supertest(server)
      .patch('/user/kesu123')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        username: 'PatchedName',
        email: 'patched@email.se',
      });

    const patchedUser: User = {
      id: 'kesu123',
      username: 'PatchedName',
      email: 'patched@email.se',
    };

    expect(saveUser).toHaveBeenCalledWith(patchedUser);

    const returnedUser: ResolvedUser = {
      id: 'kesu123',
      username: 'PatchedName',
      email: 'patched@email.se',
      profilePictureUrl:
        'https://gravatar.com/avatar/45c1fd0ca3f1209630315e09f28f1ad9',
      topStarredRepositories: ['two', 'one'],
    };

    expect(res).toHaveProperty('status', StatusCodes.OK);
    expect(res.body).toEqual(returnedUser);
  });

  test('Success, with a single property', async () => {
    const repos: Repo[] = [
      {full_name: 'zero', stargazers_count: 0},
      {full_name: 'one', stargazers_count: 1},
      {full_name: 'two', stargazers_count: 2},
    ];
    nock('https://api.github.com')
      .get('/users/PatchedName/repos')
      .reply(200, repos);

    const existingUser: User = {
      id: 'kesu123',
      username: 'KennethSundqvist',
      email: 'kenneth@kesu.se',
    };

    (getUser as unknown as jest.Mock).mockReturnValue(existingUser);

    const res = await supertest(server)
      .patch('/user/kesu123')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        username: 'PatchedName',
      });

    const patchedUser: User = {
      id: 'kesu123',
      username: 'PatchedName',
      email: 'kenneth@kesu.se',
    };

    expect(saveUser).toHaveBeenCalledWith(patchedUser);

    const returnedUser: ResolvedUser = {
      id: 'kesu123',
      username: 'PatchedName',
      email: 'kenneth@kesu.se',
      profilePictureUrl:
        'https://gravatar.com/avatar/a282d3c5e1f6cea30064dd6ba0a9810e',
      topStarredRepositories: ['two', 'one'],
    };

    expect(res).toHaveProperty('status', StatusCodes.OK);
    expect(res.body).toEqual(returnedUser);
  });

  test("User doesn't exists", async () => {
    const res = await supertest(server)
      .patch('/user/kesu123')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        username: 'PatchedName',
      });

    expect(res).toHaveProperty('status', StatusCodes.NOT_FOUND);
  });

  test('Input email must be valid', async () => {
    const res = await supertest(server)
      .patch('/user/kesu123')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        email: 'invalid',
      });

    expect(res).toHaveProperty('status', StatusCodes.UNPROCESSABLE_ENTITY);
    expect(res.body).toEqual({
      email: 'Invalid email',
    });
  });

  test('Not allowed to patch "id"', async () => {
    const res = await supertest(server)
      .patch('/user/kesu123')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        id: 'nope',
      });

    expect(res).toHaveProperty('status', StatusCodes.BAD_REQUEST);
    expect(res.text).toEqual(
      'Cannot patch the following properties on a User: id',
    );
  });

  test('Not allowed to patch resolved properties', async () => {
    const res = await supertest(server)
      .patch('/user/kesu123')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        profilePictureUrl: 'nope',
        topStarredRepositories: 'nope',
      });

    expect(res).toHaveProperty('status', StatusCodes.BAD_REQUEST);
    expect(res.text).toEqual(
      'Cannot patch the following properties on a User: profilePictureUrl, topStarredRepositories',
    );
  });

  test('Not allowed to patch unknown properties', async () => {
    const res = await supertest(server)
      .patch('/user/kesu123')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        unknown: 'nope',
      });

    expect(res).toHaveProperty('status', StatusCodes.BAD_REQUEST);
    expect(res.text).toEqual(
      'Cannot patch the following properties on a User: unknown',
    );
  });

  test('Fails gracefully and returns the rest of the user data when the top starred repositories are unavailable', async () => {
    nock('https://api.github.com').get('/users/PatchedName/repos').reply(404);

    const existingUser: User = {
      id: 'kesu123',
      username: 'KennethSundqvist',
      email: 'kenneth@kesu.se',
    };

    (getUser as unknown as jest.Mock).mockReturnValue(existingUser);

    const res = await supertest(server)
      .patch('/user/kesu123')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        username: 'PatchedName',
      });

    const patchedUser: User = {
      id: 'kesu123',
      username: 'PatchedName',
      email: 'kenneth@kesu.se',
    };

    expect(saveUser).toHaveBeenCalledWith(patchedUser);

    const returnedUser: ResolvedUser = {
      id: 'kesu123',
      username: 'PatchedName',
      email: 'kenneth@kesu.se',
      profilePictureUrl:
        'https://gravatar.com/avatar/a282d3c5e1f6cea30064dd6ba0a9810e',
      topStarredRepositories: [],
    };

    expect(res).toHaveProperty('status', StatusCodes.OK);
    expect(res.body).toEqual(returnedUser);
  });

  test('Incorrect accept header', async () => {
    const res = await supertest(server)
      .patch('/user/kesu123')
      .set('Accept', 'text/plain')
      .set('Content-Type', 'application/json')
      .send({username: 'PatchedName'});

    expect(res).toHaveProperty('status', StatusCodes.NOT_ACCEPTABLE);
    expect(res.text).toEqual('Accept must be: application/json');
  });

  test('Incorrect content type header', async () => {
    const res = await supertest(server)
      .patch('/user/kesu123')
      .set('Accept', 'application/json')
      .set('Content-Type', 'text/plain')
      .send('Hello!');

    expect(res).toHaveProperty('status', StatusCodes.UNSUPPORTED_MEDIA_TYPE);
    expect(res.text).toEqual('Content-Type must be: application/json');
  });
});
