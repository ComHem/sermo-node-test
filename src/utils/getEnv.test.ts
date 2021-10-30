import {getEnv} from './getEnv.js';

test('Value is set', async () => {
  process.env.SECRET_TOKEN = 'value-is-set-123';

  const value = getEnv('SECRET_TOKEN');

  expect(value).toBe('value-is-set-123');
});

test('Value is not set', async () => {
  delete process.env.SECRET_TOKEN;

  expect(() => {
    const value = getEnv('SECRET_TOKEN');
    console.log(`This value should not be logged:`, value);
  }).toThrowError('"process.env.SECRET_TOKEN" is not set.');
});
