import supertest from 'supertest';
import {server} from '../index.js';
import {StatusCodes} from 'http-status-codes';

describe('Hello world', () => {
  test('Success', async () => {
    const res = await supertest(server).post('/user').send();

    expect(res).toHaveProperty('status', StatusCodes.NO_CONTENT);
  });
});
