// Use this logger so it's easier to stubb all application logging in
// tests.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function log(...args: any[]): void {
  // TODO: Replace with structured logging.
  console.log(...args);
}
