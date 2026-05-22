/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['babel-jest', { configFile: './babel.config.cjs' }],
  },
  // lucide-react ships as ESM — include it in babel transformation
  transformIgnorePatterns: ['/node_modules/(?!(lucide-react)/)'],
  moduleNameMapper: {
    '^framer-motion$': '<rootDir>/__mocks__/framer-motion.cjs',
    '^.+\\.css$': '<rootDir>/__mocks__/styleMock.cjs',
  },
  testMatch: ['**/*.test.{ts,tsx}'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/components/**/*.{ts,tsx}', '!src/**/*.d.ts'],
};
