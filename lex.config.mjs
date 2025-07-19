export default {
  ai: {
    maxTokens: 4000,
    model: 'cursor-code',
    provider: 'cursor',
    temperature: 0.1
  },
  entryJS: 'app.tsx',
  gitUrl: 'https://github.com/nitrogenlabs/metropolisjs',
  jest: {
    testEnvironment: 'jsdom'
  },
  outputPath: 'lib',
  targetEnvironment: 'web',
  useESM: true,
  useTypescript: true
};