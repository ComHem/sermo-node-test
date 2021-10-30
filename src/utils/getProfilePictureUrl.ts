import crypto from 'crypto';

export function getProfilePictureUrl(email: string): string {
  // The hash must be created as follows:
  //
  // 1. Trim leading and trailing whitespace from an email address
  // 2. Force all characters to lower-case
  // 3. md5 hash the final string
  //
  // https://en.gravatar.com/site/implement/hash/

  const hash = crypto
    .createHash('md5')
    .update(email.trim().toLowerCase())
    .digest('hex');

  return `https://gravatar.com/avatar/${hash}`;
}
