export default {
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
    testEnvironment: 'jsdom'
  },
  targetEnvironment: 'web',
  useTypescript: true,
  useESM: true
};