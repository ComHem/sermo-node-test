import nock from 'nock';
import {getTopStarredRepositories, Repo} from './getTopStarredRepositories.js';

const username = 'KennethSundqvist';

function mockRequest(repos: Repo[]) {
  const req = nock('https://api.github.com').get(`/users/${username}/repos`);
  req.reply(200, repos);
  return req;
}

afterEach(() => {
  if (!nock.isDone()) {
    console.log('Pending nock mocks:', nock.pendingMocks());
  }
  nock.cleanAll();
});

test('It excludes repos without any stargazers', async () => {
  mockRequest([
    {full_name: 'one', stargazers_count: 1},
    {full_name: 'zero', stargazers_count: 0},
  ]);

  const result = await getTopStarredRepositories(username);

  expect(result).toEqual(['one']);
});

test('It sorts the repositories by stargazers in descending order', async () => {
  mockRequest([
    {full_name: 'one', stargazers_count: 1},
    {full_name: 'two', stargazers_count: 2},
  ]);

  const result = await getTopStarredRepositories(username);

  expect(result).toEqual(['two', 'one']);
});

test('It only includes the 10 repositories with the most stargazers', async () => {
  const allRepos: Repo[] = [
    {full_name: '1', stargazers_count: 1},
    {full_name: '2', stargazers_count: 2},
    {full_name: '3', stargazers_count: 3},
    {full_name: '4', stargazers_count: 4},
    {full_name: '5', stargazers_count: 5},
    {full_name: '6', stargazers_count: 6},
    {full_name: '7', stargazers_count: 7},
    {full_name: '8', stargazers_count: 8},
    {full_name: '9', stargazers_count: 9},
    {full_name: '10', stargazers_count: 10},
    {full_name: '11', stargazers_count: 11},
  ];

  mockRequest(allRepos);

  const result = await getTopStarredRepositories(username);

  expect(allRepos).toHaveLength(11);
  expect(result).toHaveLength(10);
});
