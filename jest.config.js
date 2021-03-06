const tsconfig = require('./tsconfig.json');

// eslint-disable-next-line import/order
const moduleNameMapper = require('tsconfig-paths-jest')(tsconfig);

module.exports = {
  roots: ['<rootDir>/src'],
  moduleNameMapper,
  setupFilesAfterEnv: ['./setupTest.js'],
  testRegex: ['.test.ts$'],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'js'],
};
