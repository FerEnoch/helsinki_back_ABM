/** @type { import('jest').Config } */
import path from 'node:path';

const devMode = process.env.NODE_ENV === 'development';
const ignoredPathOnDevelopment = devMode ? path.join(process.cwd(), 'test', 'beOnProduction.test.js') : '';

const config = {
  verbose: true,
  testPathIgnorePatterns: devMode ? [ignoredPathOnDevelopment, '/node_modules'] : [],
};

export default config;
