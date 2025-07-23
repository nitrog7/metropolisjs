import {Config} from '@nlabs/lex';

export default Config.create({
  ai: {
    maxTokens: 4000,
    model: 'cursor-code',
    provider: 'cursor',
    temperature: 0.1
  },
  entryJS: 'app.tsx',
  esbuild: {
    minify: process.env.NODE_ENV === 'production'
  },
  gitUrl: 'https://github.com/nitrogenlabs/metropolisjs',
  jest: {
    testEnvironment: 'jsdom'
  },
  outputPath: 'lib',
  targetEnvironment: 'web',
  useESM: true,
  useTypescript: true
});