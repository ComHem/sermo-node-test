import supertest from 'supertest';
import {server} from '../../index.js';
import {StatusCodes} from 'http-status-codes';
import nock from 'nock';
import {Repo} from '../../utils/getTopStarredRepositories.js';
import {getUser} from '../../utils/database.js';
import {User, ResolvedUser} from '../../types/user.js';

jest.mock('../../utils/database.js');
jest.mock('../../utils/log.js');

afterEach(() => {
  jest.resetAllMocks();
  if (!nock.isDone()) {
    console.log('Pending nock mocks:', nock.pendingMocks());
  }
  nock.cleanAll();
});

describe('Read (GET) User', () => {
  test('Success', async () => {
    const repos: Repo[] = [
      {full_name: 'zero', stargazers_count: 0},
      {full_name: 'one', stargazers_count: 1},
      {full_name: 'two', stargazers_count: 2},
    ];
    nock('https://api.github.com')
      .get('/users/KennethSundqvist/repos')
      .reply(200, repos);

    const existingUser: User = {
      id: 'kesu123',
      username: 'KennethSundqvist',
      email: 'kenneth@kesu.se',
    };

    (getUser as unknown as jest.Mock).mockReturnValue(existingUser);

    const res = await supertest(server)
      .get('/user/ kesu123')
      .set('Accept', 'application/json');

    const expectedUser: ResolvedUser = {
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

  test("User doesn't exists", async () => {
    const res = await supertest(server)
      .get('/user/kesu123')
      .set('Accept', 'application/json');

    expect(res).toHaveProperty('status', StatusCodes.NOT_FOUND);
  });

  test('Fails gracefully and returns the rest of the user data when the top starred repositories are unavailable', async () => {
    nock('https://api.github.com')
      .get('/users/KennethSundqvist/repos')
      .reply(404);

    const existingUser: User = {
      id: 'kesu123',
      username: 'KennethSundqvist',
      email: 'kenneth@kesu.se',
    };

    (getUser as unknown as jest.Mock).mockReturnValue(existingUser);

    const res = await supertest(server)
      .get('/user/kesu123')
      .set('Accept', 'application/json');

    const expectedUser: ResolvedUser = {
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
      .get('/user/kesu123')
      .set('Accept', 'text/plain');

    expect(res).toHaveProperty('status', StatusCodes.NOT_ACCEPTABLE);
    expect(res.text).toEqual('Accept must be: application/json');
  });
});
