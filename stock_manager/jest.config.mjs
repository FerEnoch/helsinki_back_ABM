/** @type { import('jest').Config } */
import path from 'node:path';

const prodMode = !(process.env.NODE_ENV === 'development');
const devMode = !(process.env.NODE_ENV === 'production');
const stagingMode = process.env.STAGING;

const prodRoute = path.join(process.cwd(), 'test', 'beOnProduction.test.js');
const devRoute = path.join(process.cwd(), 'test', 'beOnDevelopment.test.js');
const stagingRoute = path.join(process.cwd(), 'test', 'beOnStaging.test.js');

// const ignoredPath = devMode ? prodModeTesting : devModeTesting;

const ignoredPaths = [
  prodMode && [devRoute, !stagingMode && stagingRoute].filter(Boolean),
  devMode && [prodRoute, stagingRoute],
  stagingMode && [devRoute, prodRoute],
]
  .flat()
  .filter(Boolean);

const config = {
  verbose: true,
  testPathIgnorePatterns: [...ignoredPaths, '/node_modules'],
};

export default config;
