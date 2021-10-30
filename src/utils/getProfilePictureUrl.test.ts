import {getProfilePictureUrl} from './getProfilePictureUrl.js';

test('It trims whitespace', () => {
  const without = getProfilePictureUrl('kenneth@kesu.se');
  const leading = getProfilePictureUrl(' kenneth@kesu.se');
  const trailing = getProfilePictureUrl('kenneth@kesu.se ');

  expect(leading).toBe(without);
  expect(trailing).toBe(without);
});

test('It forces all characters to lowe-case', () => {
  const lowercase = getProfilePictureUrl('kenneth@kesu.se');
  const uppercase = getProfilePictureUrl('KENNETH@KESU.SE');

  expect(uppercase).toBe(lowercase);
});
