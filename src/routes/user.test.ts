import supertest from 'supertest';
import {server} from '../index.js';
import {StatusCodes} from 'http-status-codes';
import {User} from './user.js';
import nock from 'nock';
import {Repo} from '../utils/getTopStarredRepositories.js';
import {getUser} from '../utils/database.js';

jest.mock('../utils/database.js');

afterEach(() => {
  jest.resetAllMocks();
  if (!nock.isDone()) {
    console.log('Pending nock mocks:', nock.pendingMocks());
  }
  nock.cleanAll();
});

describe('Create (POST) User', () => {
  test('Success', async () => {
    const repos: Repo[] = [
      {full_name: 'zero', stargazers_count: 0},
      {full_name: 'one', stargazers_count: 1},
      {full_name: 'two', stargazers_count: 2},
    ];
    nock('https://api.github.com')
      .get('/users/KennethSundqvist/repos')
      .reply(200, repos);

    const res = await supertest(server)
      .post('/user')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        id: 'kesu123',
        username: 'KennethSundqvist',
        email: 'kenneth@kesu.se',
      });

    const expectedUser: User = {
      id: 'kesu123',
      username: 'KennethSundqvist',
      email: 'kenneth@kesu.se',
      profilePictureUrl:
        'https://gravatar.com/avatar/a282d3c5e1f6cea30064dd6ba0a9810e',
      topStarredRepositories: ['two', 'one'],
    };

    expect(res).toHaveProperty('status', StatusCodes.OK);
    expect(res.body).toEqual(expectedUser);
  });

  test('User already exists', async () => {
    const existingUser: User = {
      id: 'kesu123',
      username: 'KennethSundqvist',
      email: 'kenneth@kesu.se',
      profilePictureUrl:
        'https://gravatar.com/avatar/a282d3c5e1f6cea30064dd6ba0a9810e',
      topStarredRepositories: ['two', 'one'],
    };

    (getUser as unknown as jest.Mock).mockReturnValue(existingUser);

    const res = await supertest(server)
      .post('/user')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        id: 'kesu123',
        username: 'KennethSundqvist',
        email: 'kenneth@kesu.se',
      });

    expect(res).toHaveProperty('status', StatusCodes.BAD_REQUEST);
    expect(res.body).toEqual({
      id: `A user with ID "kesu123" already exists`,
    });
  });

  test('Input data is required', async () => {
    const res = await supertest(server)
      .post('/user')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        id: '',
        username: '',
        email: '',
      });

    expect(res).toHaveProperty('status', StatusCodes.UNPROCESSABLE_ENTITY);
    expect(res.body).toEqual({
      id: 'Required',
      username: 'Required',
      email: 'Required',
    });
  });

  test('Input email must be valid', async () => {
    const res = await supertest(server)
      .post('/user')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        id: 'kesu123',
        username: 'KennethSundqvist',
        email: 'invalid',
      });

    expect(res).toHaveProperty('status', StatusCodes.UNPROCESSABLE_ENTITY);
    expect(res.body).toEqual({
      email: 'Invalid email',
    });
  });

  test('Fails gracefully and returns the rest of the user data when the top starred repositories are unavailable', async () => {
    // Avoid logging in tests. Replace console.log with a log util and stub that in the tests.
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    jest.spyOn(console, 'log').mockImplementation(() => {});

    nock('https://api.github.com')
      .get('/users/KennethSundqvist/repos')
      .reply(404);

    const res = await supertest(server)
      .post('/user')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        id: 'kesu123',
        username: 'KennethSundqvist',
        email: 'kenneth@kesu.se',
      });

    const expectedUser: User = {
      id: 'kesu123',
      username: 'KennethSundqvist',
      email: 'kenneth@kesu.se',
      profilePictureUrl:
        'https://gravatar.com/avatar/a282d3c5e1f6cea30064dd6ba0a9810e',
      topStarredRepositories: [],
    };

    expect(res).toHaveProperty('status', StatusCodes.OK);
    expect(res.body).toEqual(expectedUser);
  });

  test('Incorrect accept header', async () => {
    const res = await supertest(server)
      .post('/user')
      .set('Accept', 'text/plain')
      .set('Content-Type', 'application/json')
      .send({
        id: 'kesu123',
        username: 'KennethSundqvist',
        email: 'kenneth@kesu.se',
      });

    expect(res).toHaveProperty('status', StatusCodes.NOT_ACCEPTABLE);
    expect(res.text).toEqual('Accept must be: application/json');
  });

  test('Incorrect content type header', async () => {
    const res = await supertest(server)
      .post('/user')
      .set('Accept', 'application/json')
      .set('Content-Type', 'text/plain')
      .send('Hello!');

    expect(res).toHaveProperty('status', StatusCodes.UNSUPPORTED_MEDIA_TYPE);
    expect(res.text).toEqual('Content-Type must be: application/json');
  });
});
