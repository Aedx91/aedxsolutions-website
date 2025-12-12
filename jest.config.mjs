import nextJest from 'next/jest.js'
const createJestConfig = nextJest({ dir: './' })
const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/tests/', '<rootDir>/test-results/'],
}
export default createJestConfig(customJestConfig)