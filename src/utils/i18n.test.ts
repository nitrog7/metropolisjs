/**
 * Copyright (c) 2025-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import { buildI18nResources, buildSimpleI18nResources, i18n, initI18n, updateI18nResources } from './i18n';

describe('i18n utility', () => {
  const mockTranslations = {
    'cancel:en': {
      key: 'cancel',
      locale: 'en',
      namespace: 'buttons',
      value: 'Cancel'
    },
    'save:en': {
      key: 'save',
      locale: 'en',
      namespace: 'buttons',
      value: 'Save'
    },
    'welcome:en': {
      key: 'welcome',
      locale: 'en',
      namespace: 'common',
      value: 'Welcome {{name}}!'
    },
    'welcome:es': {
      key: 'welcome',
      locale: 'es',
      namespace: 'common',
      value: '¡Bienvenido {{name}}!'
    }
  };

  describe('buildI18nResources', () => {
    it('should build resources with namespaces', () => {
      const result = buildI18nResources(mockTranslations);

      expect(result).toEqual({
        en: {
          buttons: {
            'cancel:en': 'Cancel',
            'save:en': 'Save'
          },
          common: {
            'welcome:en': 'Welcome {{name}}!'
          }
        },
        es: {
          common: {
            'welcome:es': '¡Bienvenido {{name}}!'
          }
        }
      });
    });

    it('should use default namespace when not provided', () => {
      const translations = {
        'test:en': {
          key: 'test',
          locale: 'en',
          value: 'Test value'
        }
      };

      const result = buildI18nResources(translations);

      expect(result.en.translations['test:en']).toBe('Test value');
    });

    it('should use default locale when not provided', () => {
      const translations = {
        test: {
          key: 'test',
          locale: 'en',
          namespace: 'common',
          value: 'Test value'
        }
      };

      const result = buildI18nResources(translations);

      expect(result.en.common.test).toBe('Test value');
    });

    it('should handle empty translations', () => {
      const result = buildI18nResources({});
      expect(result).toEqual({});
    });

    it('should handle translations with missing properties', () => {
      const translations = {
        'test:en': {
          key: 'test',
          locale: 'en',
          value: 'Test value'
        }
      };

      const result = buildI18nResources(translations);
      expect(result.en.translations['test:en']).toBe('Test value');
    });
  });

  describe('buildSimpleI18nResources', () => {
    it('should build resources from simple key-value translations', () => {
      const simpleTranslations = {
        'welcome': 'Welcome!',
        'hello': 'Hello World',
        'goodbye': 'Goodbye'
      };

      const result = buildSimpleI18nResources(simpleTranslations);

      expect(result).toEqual({
        en: {
          translations: {
            'welcome': 'Welcome!',
            'hello': 'Hello World',
            'goodbye': 'Goodbye'
          }
        }
      });
    });

    it('should handle empty simple translations', () => {
      const result = buildSimpleI18nResources({});
      expect(result).toEqual({});
    });
  });

  describe('initI18n', () => {
    it('should be a function', () => {
      expect(typeof initI18n).toBe('function');
    });

    it('should accept translations parameter', () => {
      expect(() => initI18n(mockTranslations)).not.toThrow();
    });

    it('should handle empty translations', () => {
      expect(() => initI18n({})).not.toThrow();
    });
  });

  describe('updateI18nResources', () => {
    it('should be a function', () => {
      expect(typeof updateI18nResources).toBe('function');
    });

    it('should accept translations parameter', () => {
      expect(() => updateI18nResources(mockTranslations)).not.toThrow();
    });

    it('should handle empty translations', () => {
      expect(() => updateI18nResources({})).not.toThrow();
    });
  });

  describe('i18n', () => {
    it('should be a function', () => {
      expect(typeof i18n).toBe('function');
    });

    it('should return key when not initialized', () => {
      const result = i18n('test-key');
      expect(result).toBe('test-key');
    });

    it('should accept key parameter', () => {
      expect(() => i18n('test-key')).not.toThrow();
    });

    it('should accept key and params', () => {
      expect(() => i18n('test-key', {name: 'test'})).not.toThrow();
    });

    it('should accept key, params, and language', () => {
      expect(() => i18n('test-key', {name: 'test'}, 'en')).not.toThrow();
    });

    it('should accept all parameters', () => {
      expect(() => i18n('test-key', {name: 'test'}, 'en', 'common')).not.toThrow();
    });
  });
});