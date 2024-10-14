// jest.config.js
export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(js|mjs)$': 'babel-jest', // Trasforma i file js e mjs usando babel-jest
  },
};
