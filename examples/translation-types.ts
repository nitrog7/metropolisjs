/**
 * Copyright (c) 2025-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */

// Define the types directly to avoid JSX compilation issues
type SimpleTranslations = Record<string, string>;

interface ComplexTranslation {
  readonly value: string;
  readonly locale: string;
  readonly namespace?: string;
}

type ComplexTranslations = Record<string, ComplexTranslation>;

// Test simple translations type
const simpleTranslations: SimpleTranslations = {
  'welcome': 'Welcome to MetropolisJS!',
  'hello': 'Hello {{name}}!',
  'goodbye': 'Goodbye'
};

// Test complex translations type
const complexTranslations: ComplexTranslations = {
  'welcome:en': {
    value: 'Welcome to MetropolisJS!',
    locale: 'en',
    namespace: 'common'
  },
  'hello:en': {
    value: 'Hello {{name}}!',
    locale: 'en',
    namespace: 'common'
  },
  'save:en': {
    value: 'Save',
    locale: 'en',
    namespace: 'buttons'
  }
};

// Test individual complex translation type
const singleTranslation: ComplexTranslation = {
  value: 'Test translation',
  locale: 'en',
  namespace: 'test'
};

// Function to demonstrate type safety
function processTranslations(translations: SimpleTranslations | ComplexTranslations): void {
  if (Object.keys(translations).length === 0) {
    console.log('No translations provided');
    return;
  }

  const firstKey = Object.keys(translations)[0];
  const firstValue = translations[firstKey];

  if (typeof firstValue === 'string') {
    // TypeScript knows this is SimpleTranslations
    console.log('Processing simple translations');
    Object.entries(translations as SimpleTranslations).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
  } else if (typeof firstValue === 'object' && firstValue !== null && 'value' in firstValue) {
    // TypeScript knows this is ComplexTranslations
    console.log('Processing complex translations');
    Object.entries(translations as ComplexTranslations).forEach(([key, translation]) => {
      console.log(`${key}: ${translation.value} (${translation.locale}${translation.namespace ? `, ${translation.namespace}` : ''})`);
    });
  }
}

// Test the function with both types
console.log('Testing simple translations:');
processTranslations(simpleTranslations);

console.log('\nTesting complex translations:');
processTranslations(complexTranslations);

console.log('\nType test completed successfully!');

// Export for use in other files
export { complexTranslations, processTranslations, simpleTranslations, singleTranslation };
export type { ComplexTranslation, ComplexTranslations, SimpleTranslations };
