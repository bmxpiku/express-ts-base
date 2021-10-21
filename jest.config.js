module.exports = {
  coverageReporters: ['html'],
  coverageDirectory: '<rootDir>/tests/coverage',
  collectCoverageFrom: ['src/**/*.ts'],
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.ts',
  ],
  transform: {
    '^.+\\.(ts|js)?$': 'babel-jest',
  },
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
  },
  clearMocks: true,
};
