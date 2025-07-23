/**
 * Copyright (c) 2025-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import { ComplexTranslations, Metropolis, SimpleTranslations } from '../src/index';
import { i18n } from '../src/utils/i18n';

// Example translations object with simple key-value pairs
const simpleTranslations: SimpleTranslations = {
  'welcome': 'Welcome to MetropolisJS!',
  'hello': 'Hello {{name}}!',
  'goodbye': 'Goodbye',
  'loading': 'Loading...',
  'error': 'An error occurred',
  'success': 'Operation completed successfully',
  'cancel': 'Cancel',
  'save': 'Save',
  'delete': 'Delete',
  'edit': 'Edit',
  'create': 'Create',
  'update': 'Update',
  'search': 'Search',
  'filter': 'Filter',
  'sort': 'Sort',
  'refresh': 'Refresh',
  'back': 'Back',
  'next': 'Next',
  'previous': 'Previous',
  'submit': 'Submit',
  'reset': 'Reset',
  'confirm': 'Confirm',
  'yes': 'Yes',
  'no': 'No',
  'ok': 'OK',
  'close': 'Close',
  'open': 'Open',
  'show': 'Show',
  'hide': 'Hide',
  'expand': 'Expand',
  'collapse': 'Collapse',
  'minimize': 'Minimize',
  'maximize': 'Maximize',
  'fullscreen': 'Fullscreen',
  'settings': 'Settings',
  'profile': 'Profile',
  'account': 'Account',
  'logout': 'Logout',
  'login': 'Login',
  'register': 'Register',
  'forgot_password': 'Forgot Password?',
  'remember_me': 'Remember Me',
  'email': 'Email',
  'password': 'Password',
  'username': 'Username',
  'first_name': 'First Name',
  'last_name': 'Last Name',
  'phone': 'Phone',
  'address': 'Address',
  'city': 'City',
  'state': 'State',
  'country': 'Country',
  'zip_code': 'ZIP Code',
  'birth_date': 'Birth Date',
  'gender': 'Gender',
  'male': 'Male',
  'female': 'Female',
  'other': 'Other',
  'prefer_not_to_say': 'Prefer not to say'
};

// Example complex translations with locale and namespace support
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
  },
  'cancel:en': {
    value: 'Cancel',
    locale: 'en',
    namespace: 'buttons'
  },
  'welcome:es': {
    value: '¡Bienvenido a MetropolisJS!',
    locale: 'es',
    namespace: 'common'
  },
  'hello:es': {
    value: '¡Hola {{name}}!',
    locale: 'es',
    namespace: 'common'
  },
  'save:es': {
    value: 'Guardar',
    locale: 'es',
    namespace: 'buttons'
  }
};

// Example React component using Metropolis with simple translations
const SimpleTranslationApp: React.FC = () => {
  return (
    <Metropolis
      translations={simpleTranslations}
      config={{
        development: {
          app: {
            api: {
              url: 'https://api.example.com'
            },
            urls: {
              websocket: 'wss://ws.example.com'
            }
          }
        }
      }}
    >
      <div>
        <h1>{i18n('welcome')}</h1>
        <p>{i18n('hello', {name: 'John'})}</p>
        <button>{i18n('save')}</button>
        <button>{i18n('cancel')}</button>
        <p>{i18n('loading')}</p>
      </div>
    </Metropolis>
  );
};

// Example React component using Metropolis with complex translations
const ComplexTranslationApp: React.FC = () => {
  return (
    <Metropolis
      translations={complexTranslations}
      config={{
        development: {
          app: {
            api: {
              url: 'https://api.example.com'
            },
            urls: {
              websocket: 'wss://ws.example.com'
            }
          }
        }
      }}
    >
      <div>
        <h1>{i18n('welcome', {}, 'en', 'common')}</h1>
        <p>{i18n('hello', {name: 'John'}, 'en', 'common')}</p>
        <button>{i18n('save', {}, 'en', 'buttons')}</button>
        <button>{i18n('cancel', {}, 'en', 'buttons')}</button>
        <p>{i18n('loading')}</p>
      </div>
    </Metropolis>
  );
};

// Example of using translations in a component
const UserProfile: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [user, setUser] = React.useState({name: 'John Doe'});

  return (
    <div>
      <h2>{i18n('profile')}</h2>
      {isLoading ? (
        <p>{i18n('loading')}</p>
      ) : (
        <div>
          <p>{i18n('hello', {name: user.name})}</p>
          <button>{i18n('edit')}</button>
          <button>{i18n('delete')}</button>
        </div>
      )}
    </div>
  );
};

// Example of a form component with translations
const LoginForm: React.FC = () => {
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{i18n('login')}</h2>

      <div>
        <label htmlFor="email">{i18n('email')}:</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
      </div>

      <div>
        <label htmlFor="password">{i18n('password')}:</label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={formData.rememberMe}
            onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
          />
          {i18n('remember_me')}
        </label>
      </div>

      <div>
        <button type="submit">{i18n('login')}</button>
        <button type="button">{i18n('cancel')}</button>
      </div>

      <div>
        <a href="#forgot-password">{i18n('forgot_password')}</a>
      </div>
    </form>
  );
};

// Example of a multilingual app that can switch between simple and complex translations
const MultilingualApp: React.FC = () => {
  const [useComplexTranslations, setUseComplexTranslations] = React.useState(false);
  const [currentLocale, setCurrentLocale] = React.useState<'en' | 'es'>('en');

  const selectedTranslations = useComplexTranslations ? complexTranslations : simpleTranslations;

  return (
    <Metropolis
      translations={selectedTranslations}
      config={{
        development: {
          app: {
            api: {
              url: 'https://api.example.com'
            },
            urls: {
              websocket: 'wss://ws.example.com'
            }
          }
        }
      }}
    >
      <div>
        <div style={{marginBottom: '20px'}}>
          <label>
            <input
              type="checkbox"
              checked={useComplexTranslations}
              onChange={(e) => setUseComplexTranslations(e.target.checked)}
            />
            Use Complex Translations
          </label>

          {useComplexTranslations && (
            <div style={{marginLeft: '20px'}}>
              <label>
                Locale:
                <select value={currentLocale} onChange={(e) => setCurrentLocale(e.target.value as 'en' | 'es')}>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </label>
            </div>
          )}
        </div>

        <h1>
          {useComplexTranslations
            ? i18n('welcome', {}, currentLocale, 'common')
            : i18n('welcome')
          }
        </h1>

        <p>
          {useComplexTranslations
            ? i18n('hello', {name: 'World'}, currentLocale, 'common')
            : i18n('hello', {name: 'World'})
          }
        </p>

        <div>
          <button>
            {useComplexTranslations
              ? i18n('save', {}, currentLocale, 'buttons')
              : i18n('save')
            }
          </button>
          <button>
            {useComplexTranslations
              ? i18n('cancel', {}, currentLocale, 'buttons')
              : i18n('cancel')
            }
          </button>
        </div>

        <UserProfile />
        <LoginForm />
      </div>
    </Metropolis>
  );
};

export default MultilingualApp;
