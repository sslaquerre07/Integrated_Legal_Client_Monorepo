import nextJest from 'next/jest.js'
import type { Config } from 'jest'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom', // Simulates a browser environment for React components
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Used to load extra matchers like jest-dom
  testMatch: ['**/*.test.(ts|tsx)'],
}

export default createJestConfig(config)