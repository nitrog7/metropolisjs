module.exports = {
  ai: {
    maxTokens: 4000,
    model: 'cursor-code',
    provider: 'cursor',
    temperature: 0.1
  },
  entryJS: 'app.tsx',
  gitUrl: 'https://github.com/nitrogenlabs/metropolisjs',
  outputPath: 'lib',
  jest: {
    testEnvironment: 'jsdom',
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    globals: {
      'ts-jest': {
        useESM: true
      }
    },
    transformIgnorePatterns: [
      'node_modules/(?!(zod|@nlabs|p-debounce)/)'
    ],
    moduleNameMapper: {
      '^@nlabs/utils$': '<rootDir>/node_modules/@nlabs/utils/lib/index.js',
      '^@nlabs/arkhamjs$': '<rootDir>/__mocks__/@nlabs/arkhamjs/index.js',
      '^@nlabs/arkhamjs-utils-react$': '<rootDir>/node_modules/@nlabs/arkhamjs-utils-react',
      '^@nlabs/arkhamjs-storage-browser$': '<rootDir>/node_modules/@nlabs/arkhamjs-storage-browser',
      '^@nlabs/rip-hunter$': '<rootDir>/__mocks__/@nlabs/rip-hunter/index.js',
      '^p-debounce$': '<rootDir>/__mocks__/p-debounce/index.js'
    }
  },
  preset: 'node22',
  targetEnvironment: 'web',
  useTypescript: true
};