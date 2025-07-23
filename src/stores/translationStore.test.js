const {TRANSLATION_CONSTANTS, translationStore} = require('./translationStore');

describe('translationStore', () => {
  it('should have expected TRANSLATION_CONSTANTS values', () => {
    expect(TRANSLATION_CONSTANTS).toEqual({
      TRANSLATION_ADD_SUCCESS: 'TRANSLATION_ADD_SUCCESS',
      TRANSLATION_GET_ITEM_SUCCESS: 'TRANSLATION_GET_ITEM_SUCCESS',
      TRANSLATION_GET_LIST_SUCCESS: 'TRANSLATION_GET_LIST_SUCCESS',
      TRANSLATION_PROCESS_PENDING_SUCCESS: 'TRANSLATION_PROCESS_PENDING_SUCCESS',
      TRANSLATION_SYNC_SUCCESS: 'TRANSLATION_SYNC_SUCCESS'
    });
  });

  describe('translationStore function', () => {
    it('should return default state for unknown action type', () => {
      const action = {type: 'UNKNOWN_ACTION'};
      const result = translationStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: false,
        lists: {},
        translations: {}
      });
    });

    it('should handle TRANSLATION_ADD_SUCCESS action', () => {
      const action = {
        type: 'TRANSLATION_ADD_SUCCESS',
        translations: [{key: 'test-key', locale: 'en', value: 'test-value'}]
      };
      const result = translationStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: true,
        lists: {},
        translations: {en: {'test-key': 'test-value'}}
      });
    });

    it('should handle TRANSLATION_GET_ITEM_SUCCESS action', () => {
      const action = {
        type: 'TRANSLATION_GET_ITEM_SUCCESS',
        translation: {key: 'test-key', locale: 'en', value: 'test-value'}
      };
      const result = translationStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: true,
        lists: {},
        translations: {en: {'test-key': 'test-value'}}
      });
    });

    it('should handle TRANSLATION_GET_LIST_SUCCESS action', () => {
      const action = {
        type: 'TRANSLATION_GET_LIST_SUCCESS',
        translations: [
          {key: 'key1', locale: 'en', value: 'value1'},
          {key: 'key2', locale: 'en', value: 'value2'}
        ]
      };
      const result = translationStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: true,
        lists: {translations: [
          {key: 'key1', locale: 'en', value: 'value1'},
          {key: 'key2', locale: 'en', value: 'value2'}
        ]},
        translations: {en: {'key1': 'value1', 'key2': 'value2'}}
      });
    });

    it('should handle TRANSLATION_PROCESS_PENDING_SUCCESS action', () => {
      const action = {
        type: 'TRANSLATION_PROCESS_PENDING_SUCCESS',
        processed: 5,
        locale: 'en'
      };
      const result = translationStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: true,
        lists: {processed: 5, locale: 'en'},
        translations: {}
      });
    });

    it('should handle TRANSLATION_SYNC_SUCCESS action', () => {
      const action = {
        type: 'TRANSLATION_SYNC_SUCCESS',
        synced: true
      };
      const result = translationStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: true,
        lists: {synced: true},
        translations: {}
      });
    });

    it('should handle TRANSLATION_ADD_SUCCESS with multiple translations', () => {
      const action = {
        type: 'TRANSLATION_ADD_SUCCESS',
        translations: [
          {key: 'key1', locale: 'en', value: 'value1'},
          {key: 'key2', locale: 'es', value: 'valor2'},
          {key: 'key3', locale: 'en', value: 'value3'}
        ]
      };
      const result = translationStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: true,
        lists: {},
        translations: {
          en: {'key1': 'value1', 'key3': 'value3'},
          es: {'key2': 'valor2'}
        }
      });
    });

    it('should handle TRANSLATION_ADD_SUCCESS with namespace', () => {
      const action = {
        type: 'TRANSLATION_ADD_SUCCESS',
        translations: [{key: 'test-key', locale: 'en', namespace: 'common', value: 'test-value'}]
      };
      const result = translationStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: true,
        lists: {},
        translations: {en: {'common.test-key': 'test-value'}}
      });
    });

    it('should handle TRANSLATION_GET_ITEM_SUCCESS with null translation', () => {
      const action = {type: 'TRANSLATION_GET_ITEM_SUCCESS', translation: null};
      const result = translationStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: true,
        lists: {},
        translations: {}
      });
    });

    it('should handle TRANSLATION_GET_LIST_SUCCESS with empty translations array', () => {
      const action = {
        type: 'TRANSLATION_GET_LIST_SUCCESS',
        translations: []
      };
      const result = translationStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: true,
        lists: {translations: []},
        translations: {}
      });
    });

    it('should handle TRANSLATION_GET_LIST_SUCCESS with single translation', () => {
      const action = {
        type: 'TRANSLATION_GET_LIST_SUCCESS',
        translations: [{key: 'single-key', locale: 'en', value: 'single-value'}]
      };
      const result = translationStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: true,
        lists: {translations: [{key: 'single-key', locale: 'en', value: 'single-value'}]},
        translations: {en: {'single-key': 'single-value'}}
      });
    });

    it('should handle TRANSLATION_PROCESS_PENDING_SUCCESS with zero processed', () => {
      const action = {
        type: 'TRANSLATION_PROCESS_PENDING_SUCCESS',
        processed: 0,
        locale: 'en'
      };
      const result = translationStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: true,
        lists: {processed: 0, locale: 'en'},
        translations: {}
      });
    });

    it('should handle TRANSLATION_SYNC_SUCCESS with false synced', () => {
      const action = {
        type: 'TRANSLATION_SYNC_SUCCESS',
        synced: false
      };
      const result = translationStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: true,
        lists: {synced: false},
        translations: {}
      });
    });

    it('should handle TRANSLATION_ADD_SUCCESS with undefined translations', () => {
      const action = {type: 'TRANSLATION_ADD_SUCCESS', translations: undefined};
      const result = translationStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: true,
        lists: {},
        translations: {}
      });
    });

    it('should handle TRANSLATION_GET_ITEM_SUCCESS with undefined translation', () => {
      const action = {type: 'TRANSLATION_GET_ITEM_SUCCESS', translation: undefined};
      const result = translationStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: true,
        lists: {},
        translations: {}
      });
    });

    it('should handle TRANSLATION_GET_LIST_SUCCESS with undefined translations', () => {
      const action = {type: 'TRANSLATION_GET_LIST_SUCCESS', translations: undefined};
      const result = translationStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: true,
        lists: {translations: undefined},
        translations: {}
      });
    });

    it('should handle action with missing type', () => {
      const action = {};
      const result = translationStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: false,
        lists: {},
        translations: {}
      });
    });

    it('should handle action with null type', () => {
      const action = {type: null};
      const result = translationStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: false,
        lists: {},
        translations: {}
      });
    });

    it('should handle action with empty type', () => {
      const action = {type: ''};
      const result = translationStore(action.type, action);
      expect(result).toEqual({
        error: null,
        isInit: false,
        lists: {},
        translations: {}
      });
    });
  });
});