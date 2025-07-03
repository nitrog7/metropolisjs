import { MessageValidationError, parseMessage, validateMessageInput } from './messageAdapter';

describe('messageAdapter', () => {
  describe('validateMessageInput', () => {
    it('should validate valid message input', () => {
      const validMessage = {
        messageId: 'msg123',
        conversationId: 'conv123',
        content: 'Hello world',
        type: 'text',
        userId: 'user123'
      };

      const result = validateMessageInput(validMessage);
      expect(result).toEqual(validMessage);
    });

    it('should handle minimal message input', () => {
      const minimalMessage = {
        messageId: 'msg123',
        content: 'Hello'
      };

      const result = validateMessageInput(minimalMessage);
      expect(result).toEqual(minimalMessage);
    });

    it('should throw MessageValidationError for invalid input', () => {
      const invalidMessage = {
        messageId: 123, // should be string
        content: 456 // should be string
      } as unknown;

      expect(() => validateMessageInput(invalidMessage)).toThrow(MessageValidationError);
    });

    it('should handle additional properties', () => {
      const messageWithExtra = {
        messageId: 'msg123',
        content: 'Hello',
        customField: 'value'
      };

      const result = validateMessageInput(messageWithExtra);
      expect(result).toEqual(messageWithExtra);
    });
  });

  describe('parseMessage', () => {
    it('should parse message with all fields', () => {
      const message = {
        _id: 'messages/123',
        _key: '123',
        messageId: 'msg123',
        conversationId: 'conv123',
        content: 'Hello world',
        type: 'text',
        userId: 'user123',
        user: {userId: 'user123', username: 'sender'},
        reactions: ['like', 'love'],
        mentions: [{userId: 'user2', username: 'user2'}],
        images: [{imageId: 'img1', url: 'image.jpg'}],
        files: [{fileId: 'file1', name: 'document.pdf'}],
        edited: true,
        editedAt: 1234567890,
        read: true,
        readAt: 1234567890,
        cached: 1234567890,
        modified: 1234567890
      };

      const result = parseMessage(message);
      expect(result.messageId).toBe('msg123');
      expect(result.conversationId).toBe('conv123');
      expect(result.content).toBe('Hello world');
      expect(result.type).toBe('text');
      expect(result.userId).toBe('user123');
      expect(result.user).toBeDefined();
      expect(result.reactions).toEqual(['like', 'love']);
      expect(result.mentions).toBeDefined();
      expect(result.images).toBeDefined();
      expect(result.files).toBeDefined();
      expect(result.edited).toBe(true);
      expect(result.editedAt).toBe(1234567890);
      expect(result.read).toBe(true);
      expect(result.readAt).toBe(1234567890);
      expect(result.cached).toBe(1234567890);
      expect(result.modified).toBe(1234567890);
    });

    it('should handle message with minimal fields', () => {
      const minimalMessage = {
        messageId: 'msg123',
        content: 'Hello'
      };

      const result = parseMessage(minimalMessage);
      expect(result.messageId).toBe('msg123');
      expect(result.content).toBe('Hello');
      expect(result.type).toBeUndefined();
      expect(result.userId).toBeUndefined();
    });

    it('should parse ArangoDB fields correctly', () => {
      const message = {
        _id: 'messages/123',
        _key: '123',
        messageId: 'msg123'
      };

      const result = parseMessage(message);
      expect(result.id).toBe('messages/123');
      expect(result.messageId).toBe('msg123');
    });

    it('should handle boolean fields', () => {
      const message = {
        messageId: 'msg123',
        content: 'Hello',
        edited: 'true',
        read: 'false'
      } as any;

      const result = parseMessage(message);
      expect(result.edited).toBe(true);
      expect(result.read).toBe(false);
    });

    it('should handle numeric fields', () => {
      const message = {
        messageId: 'msg123',
        content: 'Hello',
        editedAt: '1234567890',
        readAt: '1234567890',
        cached: '1234567890',
        modified: '1234567890'
      } as any;

      const result = parseMessage(message);
      expect(result.editedAt).toBe(1234567890);
      expect(result.readAt).toBe(1234567890);
      expect(result.cached).toBe(1234567890);
      expect(result.modified).toBe(1234567890);
    });

    it('should throw MessageValidationError for invalid message', () => {
      const invalidMessage = {
        messageId: 123, // should be string
        content: 456 // should be string
      } as unknown;

      expect(() => parseMessage(invalidMessage as any)).toThrow(MessageValidationError);
    });
  });

  describe('MessageValidationError', () => {
    it('should create error with message', () => {
      const error = new MessageValidationError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('MessageValidationError');
    });

    it('should create error with field', () => {
      const error = new MessageValidationError('Test error', 'testField');
      expect(error.message).toBe('Test error');
      expect(error.field).toBe('testField');
    });
  });
}); 