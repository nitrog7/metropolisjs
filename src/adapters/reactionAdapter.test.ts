import { parseReaction, ReactionValidationError, validateReactionInput } from './reactionAdapter';

describe('reactionAdapter', () => {
  describe('validateReactionInput', () => {
    it('should validate valid reaction input', () => {
      const validReaction = {
        reactionId: 'react123',
        type: 'like',
        userId: 'user123',
        itemId: 'post123',
        itemType: 'post'
      };

      const result = validateReactionInput(validReaction);
      expect(result).toEqual(validReaction);
    });

    it('should handle minimal reaction input', () => {
      const minimalReaction = {
        reactionId: 'react123',
        type: 'like'
      };

      const result = validateReactionInput(minimalReaction);
      expect(result).toEqual(minimalReaction);
    });

    it('should throw ReactionValidationError for invalid input', () => {
      const invalidReaction = {
        reactionId: 123, // should be string
        type: 456 // should be string
      } as unknown;

      expect(() => validateReactionInput(invalidReaction)).toThrow(ReactionValidationError);
    });

    it('should handle additional properties', () => {
      const reactionWithExtra = {
        reactionId: 'react123',
        type: 'like',
        customField: 'value'
      };

      const result = validateReactionInput(reactionWithExtra);
      expect(result).toEqual(reactionWithExtra);
    });
  });

  describe('parseReaction', () => {
    it('should parse reaction with all fields', () => {
      const reaction = {
        _id: 'reactions/123',
        _key: '123',
        reactionId: 'react123',
        type: 'like',
        userId: 'user123',
        user: {userId: 'user123', username: 'reactor'},
        itemId: 'post123',
        itemType: 'post',
        item: {postId: 'post123', content: 'Original post'},
        cached: 1234567890,
        modified: 1234567890
      };

      const result = parseReaction(reaction);
      expect(result.reactionId).toBe('react123');
      expect(result.type).toBe('like');
      expect(result.userId).toBe('user123');
      expect(result.user).toBeDefined();
      expect(result.itemId).toBe('post123');
      expect(result.itemType).toBe('post');
      expect(result.item).toBeDefined();
      expect(result.cached).toBe(1234567890);
      expect(result.modified).toBe(1234567890);
    });

    it('should handle reaction with minimal fields', () => {
      const minimalReaction = {
        reactionId: 'react123',
        type: 'like'
      };

      const result = parseReaction(minimalReaction);
      expect(result.reactionId).toBe('react123');
      expect(result.type).toBe('like');
      expect(result.userId).toBeUndefined();
      expect(result.itemId).toBeUndefined();
    });

    it('should parse ArangoDB fields correctly', () => {
      const reaction = {
        _id: 'reactions/123',
        _key: '123',
        reactionId: 'react123'
      };

      const result = parseReaction(reaction);
      expect(result.id).toBe('reactions/123');
      expect(result.reactionId).toBe('react123');
    });

    it('should handle numeric fields', () => {
      const reaction = {
        reactionId: 'react123',
        type: 'like',
        cached: '1234567890',
        modified: '1234567890'
      } as any;

      const result = parseReaction(reaction);
      expect(result.cached).toBe(1234567890);
      expect(result.modified).toBe(1234567890);
    });

    it('should throw ReactionValidationError for invalid reaction', () => {
      const invalidReaction = {
        reactionId: 123, // should be string
        type: 456 // should be string
      } as unknown;

      expect(() => parseReaction(invalidReaction as any)).toThrow(ReactionValidationError);
    });
  });

  describe('ReactionValidationError', () => {
    it('should create error with message', () => {
      const error = new ReactionValidationError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('ReactionValidationError');
    });

    it('should create error with field', () => {
      const error = new ReactionValidationError('Test error', 'testField');
      expect(error.message).toBe('Test error');
      expect(error.field).toBe('testField');
    });
  });
}); 