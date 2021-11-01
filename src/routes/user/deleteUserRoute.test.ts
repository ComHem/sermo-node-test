import {StatusCodes} from 'http-status-codes';
import nock from 'nock';
import supertest from 'supertest';
import {server} from '../../index.js';
import {deleteUser} from '../../utils/database.js';

jest.mock('../../utils/database.js');
jest.mock('../../utils/log.js');

afterEach(() => {
  jest.resetAllMocks();
  if (!nock.isDone()) {
    console.log('Pending nock mocks:', nock.pendingMocks());
  }
  nock.cleanAll();
});

describe('Delete (DELETE) User', () => {
  test('Success', async () => {
    (deleteUser as unknown as jest.Mock).mockReturnValue(null);

    const res = await supertest(server).delete('/user/ kesu123');

    expect(res).toHaveProperty('status', StatusCodes.NO_CONTENT);
  });

  test("User doesn't exists", async () => {
    (deleteUser as unknown as jest.Mock).mockReturnValue('NOT_FOUND');

    const res = await supertest(server).delete('/user/kesu123');

    expect(res).toHaveProperty('status', StatusCodes.NOT_FOUND);
  });

  test('Error when deleting user', async () => {
    (deleteUser as unknown as jest.Mock).mockReturnValue('UNKNOWN_ERROR');

    const res = await supertest(server).delete('/user/kesu123');

    expect(res).toHaveProperty('status', StatusCodes.INTERNAL_SERVER_ERROR);
  });
});
