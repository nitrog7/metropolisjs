import {parseUser, UserValidationError, validateUserInput} from './userAdapter';

describe('userAdapter', () => {
  describe('validateUserInput', () => {
    it('should validate valid user input', () => {
      const validUser = {
        userId: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User'
      };

      const result = validateUserInput(validUser);
      expect(result).toEqual(validUser);
    });

    it('should handle minimal user input', () => {
      const minimalUser = {
        userId: 'user123'
      };

      const result = validateUserInput(minimalUser);
      expect(result).toEqual(minimalUser);
    });

    it('should throw UserValidationError for invalid input', () => {
      const invalidUser = {
        email: 'invalid-email',
        userId: 123
      } as unknown;

      expect(() => validateUserInput(invalidUser)).toThrow(Error);
    });

    it('should handle additional properties', () => {
      const userWithExtra = {
        userId: 'user1',
        username: 'testuser',
        customField: 'value'
      };

      const result = validateUserInput(userWithExtra);
      expect(result).toEqual(userWithExtra);
    });
  });

  describe('parseUser', () => {
    it('should parse user with all fields', () => {
      const user = {
        _id: 'users/user1',
        _key: 'user1',
        userId: 'user1',
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        bio: 'Test bio',
        avatar: 'avatar.jpg',
        cover: 'cover.jpg',
        city: 'Test City',
        country: 'US',
        state: 'NY',
        zip: '12345',
        latitude: 40.7128,
        longitude: -74.0060,
        timezone: 'America/New_York',
        locale: 'en-US',
        verified: true,
        active: true,
        added: 1234567890,
        modified: 1234567890
      };

      const result = parseUser(user);
      expect(result.userId).toBe('user1');
      expect(result.username).toBe('testuser');
      expect(result.email).toBe('test@example.com');
      expect(result.firstName).toBe('Test');
      expect(result.lastName).toBe('User');
      expect(result.bio).toBe('Test bio');
      expect(result.avatar).toBe('avatar.jpg');
      expect(result.cover).toBe('cover.jpg');
      expect(result.city).toBe('Test City');
      expect(result.country).toBe('US');
      expect(result.state).toBe('NY');
      expect(result.zip).toBe('12345');
      expect(result.latitude).toBe(40.7128);
      expect(result.longitude).toBe(-74.0060);
      expect(result.timezone).toBe('America/New_York');
      expect(result.locale).toBe('en-US');
      expect(result.verified).toBe(true);
      expect(result.active).toBe(true);
      expect(result.added).toBe(1234567890);
      expect(result.modified).toBe(1234567890);
    });

    it('should handle user with minimal fields', () => {
      const minimalUser = {
        userId: 'user1',
        username: 'testuser'
      };

      const result = parseUser(minimalUser);
      expect(result.userId).toBe('user1');
      expect(result.username).toBe('testuser');
      expect(result.email).toBeUndefined();
      expect(result.firstName).toBeUndefined();
    });

    it('should parse ArangoDB fields correctly', () => {
      const user = {
        _id: 'users/user1',
        _key: 'user1',
        userId: 'user1',
        username: 'testuser'
      };

      const result = parseUser(user);
      expect(result.id).toBe('users/user1');
      expect(result.userId).toBe('user1');
    });

    it('should handle boolean fields', () => {
      const user = {
        userId: 'user1',
        username: 'testuser',
        verified: true,
        active: false
      };

      const result = parseUser(user);
      expect(result.verified).toBe(true);
      expect(result.active).toBe(false);
    });

    it('should handle numeric fields', () => {
      const user = {
        userId: 'user1',
        latitude: 40.7128,
        longitude: -74.0060,
        added: 1234567890,
        modified: 1234567890
      };

      const result = parseUser(user);
      expect(result.latitude).toBe(40.7128);
      expect(result.longitude).toBe(-74.0060);
      expect(result.added).toBe(1234567890);
      expect(result.modified).toBe(1234567890);
    });
  });

  describe('UserValidationError', () => {
    it('should create error with message', () => {
      const error = new UserValidationError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('UserValidationError');
    });

    it('should create error with field', () => {
      const error = new UserValidationError('Test error', 'testField');
      expect(error.message).toBe('Test error');
      expect(error.field).toBe('testField');
    });
  });
});