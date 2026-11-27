import '@testing-library/jest-dom'

// This ensures any network call fails.
// Tests must supply any data they need themselves (through Mocks).
if (typeof window !== 'undefined') {
  global.fetch = (() =>
    Promise.reject(new Error('Unmocked fetch'))) as typeof fetch
}