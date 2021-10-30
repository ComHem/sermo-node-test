type Key = 'NODE_ENV' | 'HOST' | 'PORT' | 'SECRET_TOKEN';

export function getEnv(key: Key): string {
  const val = process.env[key];
  if (!val) {
    throw new Error(`"process.env.${key}" is not set.`);
  }
  return val;
}
