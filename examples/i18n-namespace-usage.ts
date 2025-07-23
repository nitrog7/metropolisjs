/**
 * Copyright (c) 2025-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import { i18n, initI18n, updateI18nResources } from '../src/utils/i18n';

const translations = {
  'welcome:en': {
    key: 'welcome',
    locale: 'en',
    value: 'Welcome {{name}}!',
    namespace: 'common'
  },
  'save:en': {
    key: 'save',
    locale: 'en',
    value: 'Save',
    namespace: 'buttons'
  },
  'cancel:en': {
    key: 'cancel',
    locale: 'en',
    value: 'Cancel',
    namespace: 'buttons'
  },
  'login:en': {
    key: 'login',
    locale: 'en',
    value: 'Login to your account',
    namespace: 'auth'
  },
  'welcome:es': {
    key: 'welcome',
    locale: 'es',
    value: '¡Bienvenido {{name}}!',
    namespace: 'common'
  },
  'save:es': {
    key: 'save',
    locale: 'es',
    value: 'Guardar',
    namespace: 'buttons'
  }
};

const initializeTranslations = () => {
  initI18n(translations);
  console.log('i18n initialized with namespaces');
};

const demonstrateNamespaceUsage = () => {
  console.log('\n=== Namespace Usage Examples ===');

  console.log('Default namespace (translations):');
  console.log(i18n('welcome', {name: 'World'}));
  console.log(i18n('welcome', {name: 'World'}, 'en'));

  console.log('\nCommon namespace:');
  console.log(i18n('welcome', {name: 'World'}, 'en', 'common'));
  console.log(i18n('welcome', {name: 'Mundo'}, 'es', 'common'));

  console.log('\nButtons namespace:');
  console.log(i18n('save', {}, 'en', 'buttons'));
  console.log(i18n('cancel', {}, 'en', 'buttons'));
  console.log(i18n('save', {}, 'es', 'buttons'));

  console.log('\nAuth namespace:');
  console.log(i18n('login', {}, 'en', 'auth'));
};

const demonstrateDynamicUpdates = () => {
  console.log('\n=== Dynamic Updates ===');

  const newTranslations = {
    'delete:en': {
      key: 'delete',
      locale: 'en',
      value: 'Delete',
      namespace: 'buttons'
    },
    'edit:en': {
      key: 'edit',
      locale: 'en',
      value: 'Edit {{item}}',
      namespace: 'actions'
    }
  };

  updateI18nResources(newTranslations);

  console.log('New button translation:');
  console.log(i18n('delete', {}, 'en', 'buttons'));

  console.log('New action translation:');
  console.log(i18n('edit', {item: 'profile'}, 'en', 'actions'));
};

const demonstrateFallbacks = () => {
  console.log('\n=== Fallback Behavior ===');

  console.log('Missing key (returns key):');
  console.log(i18n('missing-key', {}, 'en', 'common'));

  console.log('Missing namespace (uses default):');
  console.log(i18n('welcome', {name: 'World'}, 'en', 'missing-ns'));

  console.log('Missing language (uses fallback):');
  console.log(i18n('welcome', {name: 'World'}, 'fr', 'common'));
};

const runExamples = () => {
  initializeTranslations();
  demonstrateNamespaceUsage();
  demonstrateDynamicUpdates();
  demonstrateFallbacks();
};

export { demonstrateNamespaceUsage, initializeTranslations, runExamples };
