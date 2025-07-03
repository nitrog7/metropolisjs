import { ArangoValidationError, parseDocument, removeEmptyKeys, validateDocumentInput } from './arangoAdapter';

describe('arangoAdapter', () => {
  describe('validateDocumentInput', () => {
    it('should validate valid document input', () => {
      const validDoc = {
        _id: 'users/123',
        _key: '123',
        _rev: 'abc123',
        name: 'test'
      };

      const result = validateDocumentInput(validDoc);
      expect(result).toEqual(validDoc);
    });

    it('should throw ArangoValidationError for invalid input', () => {
      const invalidDoc = {
        _id: 123, // should be string
        _key: true // should be string
      } as unknown;

      expect(() => validateDocumentInput(invalidDoc)).toThrow(ArangoValidationError);
    });

    it('should handle additional properties', () => {
      const docWithExtra = {
        _id: 'users/123',
        customField: 'value',
        anotherField: 123
      };

      const result = validateDocumentInput(docWithExtra);
      expect(result).toEqual(docWithExtra);
    });
  });

  describe('parseDocument', () => {
    it('should parse document with ArangoDB fields', () => {
      const doc = {
        _id: 'users/123',
        _key: '123',
        _rev: 'abc123',
        _oldRev: 'def456',
        _from: 'users/123',
        _to: 'posts/456',
        added: 1234567890,
        modified: 1234567890,
        name: 'test'
      };

      const result = parseDocument(doc);
      expect(result._id).toBe('users/123');
      expect(result._key).toBe('123');
      expect(result.added).toBe(1234567890);
      expect(result.modified).toBe(1234567890);
    });

    it('should handle document without ArangoDB fields', () => {
      const doc = {name: 'test', value: 123};
      const result = parseDocument(doc);
      expect(result).toEqual(doc);
    });

    it('should throw ArangoValidationError for invalid document', () => {
      const invalidDoc = {
        _id: 123, // should be string
        _key: true // should be string
      } as unknown;

      expect(() => parseDocument(invalidDoc as any)).toThrow(ArangoValidationError);
    });
  });

  describe('removeEmptyKeys', () => {
    it('should remove undefined values', () => {
      const obj = {
        name: 'test',
        value: undefined,
        count: 0,
        empty: null
      };

      const result = removeEmptyKeys(obj);
      expect(result).toEqual({
        name: 'test',
        count: 0
      });
    });

    it('should remove null values', () => {
      const obj = {
        name: 'test',
        value: null,
        count: 123
      };

      const result = removeEmptyKeys(obj);
      expect(result).toEqual({
        name: 'test',
        count: 123
      });
    });

    it('should remove empty strings', () => {
      const obj = {
        name: 'test',
        value: '',
        count: 123
      };

      const result = removeEmptyKeys(obj);
      expect(result).toEqual({
        name: 'test',
        count: 123
      });
    });

    it('should keep zero values', () => {
      const obj = {
        name: 'test',
        count: 0,
        value: false
      };

      const result = removeEmptyKeys(obj);
      expect(result).toEqual({
        name: 'test',
        count: 0,
        value: false
      });
    });
  });

  describe('ArangoValidationError', () => {
    it('should create error with message', () => {
      const error = new ArangoValidationError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('ArangoValidationError');
    });

    it('should create error with field', () => {
      const error = new ArangoValidationError('Test error', 'testField');
      expect(error.message).toBe('Test error');
      expect(error.field).toBe('testField');
    });
  });
}); 