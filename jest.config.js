export default {
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
  coverageDirectory: 'build/coverage',
  coverageProvider: 'v8',
  coverageReporters: ['text-summary', 'lcov'],
  resolver: 'jest-ts-webcompat-resolver',
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/utils/setupFilesAfterEnv.ts'],
  testMatch: ['<rootDir>/src/**/*.test.{js,jsx,ts,tsx}'],
};
