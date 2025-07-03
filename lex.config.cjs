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
  preset: 'node22',
  targetEnvironment: 'node',
  useTypescript: true
};
