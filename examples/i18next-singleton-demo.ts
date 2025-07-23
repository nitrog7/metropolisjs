/**
 * Copyright (c) 2025-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */

// This file demonstrates how i18next works as a singleton
// and how GothamJS can share the same instance as MetropolisJS

import { changeLanguage, init, t } from 'i18next';

// Step 1: MetropolisJS initializes i18next (this happens in Metropolis component)
const initializeMetropolisI18n = () => {
  console.log('🔵 MetropolisJS: Initializing i18next...');

  init({
    resources: {
      en: {
        translations: {
          'welcome': 'Welcome to MetropolisJS!',
          'save': 'Save',
          'cancel': 'Cancel',
          'shared_text': 'This text is shared between libraries',
          'hello_user': 'Hello {{name}}!'
        }
      },
      es: {
        translations: {
          'welcome': '¡Bienvenido a MetropolisJS!',
          'save': 'Guardar',
          'cancel': 'Cancelar',
          'shared_text': 'Este texto se comparte entre bibliotecas',
          'hello_user': '¡Hola {{name}}!'
        }
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

  console.log('🔵 MetropolisJS: i18next initialized successfully');
};

// Step 2: GothamJS can use the same i18next instance
const gothamJSComponent = () => {
  console.log('🟢 GothamJS: Using the same i18next instance');

  // GothamJS can import {t as i18n} from 'i18next' for consistency
  // This gives the same function name as MetropolisJS uses
  // import {t as i18n} from 'i18next';

  const gothamTitle = t('gotham_title', 'GothamJS Component'); // with fallback
  const sharedText = t('shared_text'); // uses the same translation
  const helloUser = t('hello_user', {name: 'Gotham User'}); // with interpolation

  console.log('🟢 GothamJS translations:', {
    gothamTitle,
    sharedText,
    helloUser
  });

  return {
    title: gothamTitle,
    description: sharedText,
    greeting: helloUser
  };
};

// Step 3: Demonstrate language switching affects both libraries
const demonstrateLanguageSwitching = async () => {
  console.log('\n🌍 Demonstrating language switching...');

  // Both MetropolisJS and GothamJS will see this change
  await changeLanguage('es');

  console.log('🔄 Language changed to Spanish');

  // MetropolisJS component
  const metropolisText = t('welcome');
  console.log('🔵 MetropolisJS (Spanish):', metropolisText);

  // GothamJS component - automatically uses Spanish now
  const gothamText = t('shared_text');
  console.log('🟢 GothamJS (Spanish):', gothamText);

  // Switch back to English
  await changeLanguage('en');
  console.log('🔄 Language changed back to English');

  console.log('🔵 MetropolisJS (English):', t('welcome'));
  console.log('🟢 GothamJS (English):', t('shared_text'));
};

// Step 4: Show how namespaces work across libraries
const demonstrateNamespaces = () => {
  console.log('\n📚 Demonstrating namespaces...');

  // MetropolisJS might use 'metropolis' namespace
  const metropolisText = t('dashboard_title', {ns: 'metropolis'});

  // GothamJS might use 'gotham' namespace
  const gothamText = t('widget_title', {ns: 'gotham'});

  // Both can use 'common' namespace for shared translations
  const commonText = t('shared_button', {ns: 'common'});

  console.log('🔵 MetropolisJS namespace:', metropolisText);
  console.log('🟢 GothamJS namespace:', gothamText);
  console.log('🟡 Common namespace:', commonText);
};

// Step 5: Real-world usage example
const realWorldExample = () => {
  console.log('\n🏗️ Real-world usage example:');

  // In a real React app:

  // MetropolisJS component
  const MetropolisComponent = () => {
    // This would be in a MetropolisJS component
    const title = t('dashboard_title');
    const saveButton = t('save');

    console.log('🔵 MetropolisJS component:', {title, saveButton});

    return {title, saveButton};
  };

  // GothamJS component
  const GothamComponent = () => {
    // This would be in a GothamJS component
    // import {t} from 'i18next'; // Same i18next instance!

    const widgetTitle = t('widget_title');
    const sharedButton = t('shared_button');

    console.log('🟢 GothamJS component:', {widgetTitle, sharedButton});

    return {widgetTitle, sharedButton};
  };

  const metropolis = MetropolisComponent();
  const gotham = GothamComponent();

  console.log('✅ Both components use the same i18next instance!');
  console.log('✅ Language changes affect both components!');
  console.log('✅ Namespaces keep translations organized!');

  return {metropolis, gotham};
};

// Run the demonstration
const runDemo = () => {
  console.log('🚀 i18next Singleton Demonstration');
  console.log('=====================================\n');

  // Initialize i18next (MetropolisJS does this)
  initializeMetropolisI18n();

  // GothamJS uses the same instance
  const gothamResult = gothamJSComponent();

  // Demonstrate language switching
  demonstrateLanguageSwitching();

  // Demonstrate namespaces
  demonstrateNamespaces();

  // Real-world example
  const realWorld = realWorldExample();

  console.log('\n✅ Demonstration complete!');
  console.log('✅ GothamJS can fully share i18next with MetropolisJS');
  console.log('✅ Both libraries benefit from the same translation system');

  return {
    gothamResult,
    realWorld
  };
};

export {
    demonstrateLanguageSwitching,
    demonstrateNamespaces, gothamJSComponent, initializeMetropolisI18n, realWorldExample, runDemo
};
