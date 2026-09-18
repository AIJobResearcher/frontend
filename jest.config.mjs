import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  clearMocks: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/shared/api/generated/**'],
};

/**
 * `next/jest` overwrites `transformIgnorePatterns`, so the resolved config is
 * patched afterwards to transform the ESM-only `next-intl` runtime.
 */
export default async () => {
  const resolved = await createJestConfig(config)();

  return {
    ...resolved,
    transformIgnorePatterns: [
      'node_modules/(?!(next-intl|use-intl|@formatjs|intl-messageformat)/)',
      '/.next/',
    ],
  };
};
