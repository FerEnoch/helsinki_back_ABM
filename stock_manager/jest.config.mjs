/** @type { import('jest').Config } */
import path from 'node:path';

const devMode = process.env.NODE_ENV === 'development';
const prodModeTesting = path.join(process.cwd(), 'test', 'beOnProduction.test.js');
const devModeTesting = path.join(process.cwd(), 'test', 'beOnDevelopment.test.js');
const ignoredPath = devMode ? prodModeTesting : devModeTesting;

const config = {
  verbose: true,
  testPathIgnorePatterns: [ignoredPath, '/node_modules'],
};

export default config;
