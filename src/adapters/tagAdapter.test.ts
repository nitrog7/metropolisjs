import { parseTag, TagValidationError, validateTagInput } from './tagAdapter';

describe('tagAdapter', () => {
  describe('validateTagInput', () => {
    it('should validate valid tag input', () => {
      const validTag = {
        tagId: 'tag123',
        name: 'Technology',
        description: 'Tech related content',
        category: 'tech',
        color: '#FF0000'
      };

      const result = validateTagInput(validTag);
      expect(result).toEqual(validTag);
    });

    it('should handle minimal tag input', () => {
      const minimalTag = {
        tagId: 'tag123',
        name: 'Technology'
      };

      const result = validateTagInput(minimalTag);
      expect(result).toEqual(minimalTag);
    });

    it('should throw TagValidationError for invalid input', () => {
      const invalidTag = {
        tagId: 123, // should be string
        name: 456 // should be string
      } as unknown;

      expect(() => validateTagInput(invalidTag)).toThrow(TagValidationError);
    });

    it('should handle additional properties', () => {
      const tagWithExtra = {
        tagId: 'tag123',
        name: 'Technology',
        customField: 'value'
      };

      const result = validateTagInput(tagWithExtra);
      expect(result).toEqual(tagWithExtra);
    });
  });

  describe('parseTag', () => {
    it('should parse tag with all fields', () => {
      const tag = {
        _id: 'tags/123',
        _key: '123',
        tagId: 'tag123',
        name: 'Technology',
        description: 'Tech related content',
        category: 'tech',
        color: '#FF0000',
        icon: 'tech-icon',
        image: 'tech-image.jpg',
        count: 100,
        active: true,
        featured: true,
        cached: 1234567890,
        modified: 1234567890
      };

      const result = parseTag(tag);
      expect(result.tagId).toBe('tag123');
      expect(result.name).toBe('Technology');
      expect(result.description).toBe('Tech related content');
      expect(result.category).toBe('tech');
      expect(result.color).toBe('#FF0000');
      expect(result.icon).toBe('tech-icon');
      expect(result.image).toBe('tech-image.jpg');
      expect(result.count).toBe(100);
      expect(result.active).toBe(true);
      expect(result.featured).toBe(true);
      expect(result.cached).toBe(1234567890);
      expect(result.modified).toBe(1234567890);
    });

    it('should handle tag with minimal fields', () => {
      const minimalTag = {
        tagId: 'tag123',
        name: 'Technology'
      };

      const result = parseTag(minimalTag);
      expect(result.tagId).toBe('tag123');
      expect(result.name).toBe('Technology');
      expect(result.description).toBeUndefined();
      expect(result.category).toBeUndefined();
    });

    it('should parse ArangoDB fields correctly', () => {
      const tag = {
        _id: 'tags/123',
        _key: '123',
        tagId: 'tag123'
      };

      const result = parseTag(tag);
      expect(result.id).toBe('tags/123');
      expect(result.tagId).toBe('tag123');
    });

    it('should handle boolean fields', () => {
      const tag = {
        tagId: 'tag123',
        name: 'Technology',
        active: 'true',
        featured: 'false'
      } as any;

      const result = parseTag(tag);
      expect(result.active).toBe(true);
      expect(result.featured).toBe(false);
    });

    it('should handle numeric fields', () => {
      const tag = {
        tagId: 'tag123',
        name: 'Technology',
        count: '100',
        cached: '1234567890',
        modified: '1234567890'
      } as any;

      const result = parseTag(tag);
      expect(result.count).toBe(100);
      expect(result.cached).toBe(1234567890);
      expect(result.modified).toBe(1234567890);
    });

    it('should throw TagValidationError for invalid tag', () => {
      const invalidTag = {
        tagId: 123, // should be string
        name: 456 // should be string
      } as unknown;

      expect(() => parseTag(invalidTag as any)).toThrow(TagValidationError);
    });
  });

  describe('TagValidationError', () => {
    it('should create error with message', () => {
      const error = new TagValidationError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('TagValidationError');
    });

    it('should create error with field', () => {
      const error = new TagValidationError('Test error', 'testField');
      expect(error.message).toBe('Test error');
      expect(error.field).toBe('testField');
    });
  });
}); 