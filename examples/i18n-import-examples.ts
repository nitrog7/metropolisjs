/**
 * Copyright (c) 2025-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */

// This file demonstrates different ways to import i18next functions
// for consistency across MetropolisJS and GothamJS

// Method 1: Direct import (original i18next way)
import { t } from 'i18next';

// Method 2: Aliased import for consistency (recommended)
import { t as i18n } from 'i18next';

// Method 3: Multiple imports with aliases
import { t as translate } from 'i18next';

// Example usage showing the difference:

// Using the original 't' function
const originalWay = () => {
  const welcome = t('welcome');
  const greeting = t('hello_user', {name: 'John'});
  return {welcome, greeting};
};

// Using the aliased 'i18n' function (same as MetropolisJS)
const consistentWay = () => {
  const welcome = i18n('welcome');
  const greeting = i18n('hello_user', {name: 'John'});
  return {welcome, greeting};
};

// Using the 'translate' alias
const alternativeWay = () => {
  const welcome = translate('welcome');
  const greeting = translate('hello_user', {name: 'John'});
  return {welcome, greeting};
};

// Real-world example: GothamJS component
const GothamJSComponent = () => {
  // In GothamJS, you would use:
  // import {t as i18n} from 'i18next';

  // This gives you the same function name as MetropolisJS
  const title = i18n('gotham_title');
  const description = i18n('gotham_description');
  const buttonText = i18n('gotham_button');

  return {
    title,
    description,
    buttonText
  };
};

// MetropolisJS component (for comparison)
const MetropolisJSComponent = () => {
  // In MetropolisJS, you would use:
  // import {i18n} from './utils/i18n';
  // (which internally uses i18next)

  const title = i18n('metropolis_title');
  const description = i18n('metropolis_description');
  const buttonText = i18n('metropolis_button');

  return {
    title,
    description,
    buttonText
  };
};

// Benefits of using {t as i18n}:
const benefits = {
  consistency: 'Same function name across libraries',
  familiarity: 'Developers know what i18n() does',
  maintainability: 'Easier to switch between libraries',
  clarity: 'Clear that it\'s for internationalization'
};

export {
    alternativeWay, benefits, consistentWay, GothamJSComponent,
    MetropolisJSComponent, originalWay
};
