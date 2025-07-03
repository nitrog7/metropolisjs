import { parsePost, PostValidationError, validatePostInput } from './postAdapter';

describe('postAdapter', () => {
  describe('validatePostInput', () => {
    it('should validate valid post input', () => {
      const validPost = {
        postId: 'post123',
        content: 'This is a test post',
        type: 'text',
        userId: 'user123',
        latitude: 40.7128,
        longitude: -74.0060
      };

      const result = validatePostInput(validPost);
      expect(result).toEqual(validPost);
    });

    it('should handle minimal post input', () => {
      const minimalPost = {
        postId: 'post123',
        content: 'Test post'
      };

      const result = validatePostInput(minimalPost);
      expect(result).toEqual(minimalPost);
    });

    it('should throw PostValidationError for invalid input', () => {
      const invalidPost = {
        postId: 123, // should be string
        content: 456 // should be string
      } as unknown;

      expect(() => validatePostInput(invalidPost)).toThrow(PostValidationError);
    });

    it('should handle additional properties', () => {
      const postWithExtra = {
        postId: 'post123',
        content: 'Test post',
        customField: 'value'
      };

      const result = validatePostInput(postWithExtra);
      expect(result).toEqual(postWithExtra);
    });
  });

  describe('parsePost', () => {
    it('should parse post with all fields', () => {
      const post = {
        _id: 'posts/123',
        _key: '123',
        postId: 'post123',
        content: 'This is a test post',
        type: 'text',
        userId: 'user123',
        user: {userId: 'user123', username: 'author'},
        latitude: 40.7128,
        longitude: -74.0060,
        address: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
        zip: '12345',
        reactions: ['like', 'love'],
        tags: [{tagId: 'tag1', name: 'Technology'}],
        images: [{imageId: 'img1', url: 'image.jpg'}],
        files: [{fileId: 'file1', name: 'document.pdf'}],
        mentions: [{userId: 'user2', username: 'user2'}],
        eventId: 'event123',
        event: {eventId: 'event123', name: 'Test Event'},
        groupId: 'group123',
        group: {groupId: 'group123', name: 'Test Group'},
        shared: true,
        sharedFrom: 'post456',
        sharedPost: {postId: 'post456', content: 'Original post'},
        viewCount: 100,
        commentCount: 50,
        likeCount: 25,
        cached: 1234567890,
        modified: 1234567890
      };

      const result = parsePost(post);
      expect(result.postId).toBe('post123');
      expect(result.content).toBe('This is a test post');
      expect(result.type).toBe('text');
      expect(result.userId).toBe('user123');
      expect(result.user).toBeDefined();
      expect(result.latitude).toBe(40.7128);
      expect(result.longitude).toBe(-74.0060);
      expect(result.address).toBe('123 Test St');
      expect(result.city).toBe('Test City');
      expect(result.state).toBe('Test State');
      expect(result.country).toBe('Test Country');
      expect(result.zip).toBe('12345');
      expect(result.reactions).toEqual(['like', 'love']);
      expect(result.tags).toBeDefined();
      expect(result.images).toBeDefined();
      expect(result.files).toBeDefined();
      expect(result.mentions).toBeDefined();
      expect(result.eventId).toBe('event123');
      expect(result.event).toBeDefined();
      expect(result.groupId).toBe('group123');
      expect(result.group).toBeDefined();
      expect(result.shared).toBe(true);
      expect(result.sharedFrom).toBe('post456');
      expect(result.sharedPost).toBeDefined();
      expect(result.viewCount).toBe(100);
      expect(result.commentCount).toBe(50);
      expect(result.likeCount).toBe(25);
      expect(result.cached).toBe(1234567890);
      expect(result.modified).toBe(1234567890);
    });

    it('should handle post with minimal fields', () => {
      const minimalPost = {
        postId: 'post123',
        content: 'Test post'
      };

      const result = parsePost(minimalPost);
      expect(result.postId).toBe('post123');
      expect(result.content).toBe('Test post');
      expect(result.type).toBeUndefined();
      expect(result.userId).toBeUndefined();
    });

    it('should parse ArangoDB fields correctly', () => {
      const post = {
        _id: 'posts/123',
        _key: '123',
        postId: 'post123'
      };

      const result = parsePost(post);
      expect(result.id).toBe('posts/123');
      expect(result.postId).toBe('post123');
    });

    it('should handle boolean fields', () => {
      const post = {
        postId: 'post123',
        content: 'Test post',
        shared: 'true'
      } as any;

      const result = parsePost(post);
      expect(result.shared).toBe(true);
    });

    it('should handle numeric fields', () => {
      const post = {
        postId: 'post123',
        content: 'Test post',
        latitude: '40.7128',
        longitude: '-74.0060',
        viewCount: '100',
        commentCount: '50',
        likeCount: '25',
        cached: '1234567890',
        modified: '1234567890'
      } as any;

      const result = parsePost(post);
      expect(result.latitude).toBe(40.7128);
      expect(result.longitude).toBe(-74.0060);
      expect(result.viewCount).toBe(100);
      expect(result.commentCount).toBe(50);
      expect(result.likeCount).toBe(25);
      expect(result.cached).toBe(1234567890);
      expect(result.modified).toBe(1234567890);
    });

    it('should throw PostValidationError for invalid post', () => {
      const invalidPost = {
        postId: 123, // should be string
        content: 456 // should be string
      } as unknown;

      expect(() => parsePost(invalidPost as any)).toThrow(PostValidationError);
    });
  });

  describe('PostValidationError', () => {
    it('should create error with message', () => {
      const error = new PostValidationError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('PostValidationError');
    });

    it('should create error with field', () => {
      const error = new PostValidationError('Test error', 'testField');
      expect(error.message).toBe('Test error');
      expect(error.field).toBe('testField');
    });
  });
}); 