import {describe, expect} from '@jest/globals';

import {
  ProfileValidationError,
  formatProfileOutput,
  parseProfile,
  validateProfileInput
} from './profileAdapter';

describe('profileAdapter', () => {
  describe('validateProfileInput', () => {
    it('should validate valid profile input', () => {
      const validProfile = {
        active: true,
        gender: 'M',
        name: 'John Doe',
        userId: 'user-123'
      };

      const result = validateProfileInput(validProfile);

      expect(result).toEqual(validProfile);
    });

    it('should validate profile with minimal input', () => {
      const minimalProfile = {
        name: 'Jane Doe'
      };

      const result = validateProfileInput(minimalProfile);

      expect(result).toEqual(minimalProfile);
    });

    it('should validate profile with all fields', () => {
      const fullProfile = {
        _from: 'users/456',
        _id: 'profiles/123',
        _key: '123',
        _oldRev: 'old-rev',
        _rev: 'new-rev',
        _to: 'posts/789',
        active: true,
        gender: 'F',
        hasLike: true,
        hasView: false,
        id: 'profile-123',
        imageCount: 5,
        imageId: 'image-123',
        imageUrl: 'https://example.com/profile.jpg',
        images: [{url: 'https://example.com/image.jpg'}],
        likeCount: 42,
        name: 'Jane Smith',
        profileId: 'profile-123',
        tags: [{name: 'developer'}],
        thumbUrl: 'https://example.com/thumb.jpg',
        userId: 'user-123',
        viewCount: 100
      };

      const result = validateProfileInput(fullProfile);

      expect(result).toEqual(fullProfile);
    });

    it('should throw ProfileValidationError for invalid gender', () => {
      const invalidProfile = {
        gender: 'INVALID',
        name: 'John Doe'
      };

      expect(() => validateProfileInput(invalidProfile)).toThrow(ProfileValidationError);
    });

    it('should throw ProfileValidationError for name too long', () => {
      const invalidProfile = {
        name: 'a'.repeat(65)
      };

      expect(() => validateProfileInput(invalidProfile)).toThrow(ProfileValidationError);
    });

    it('should handle empty object', () => {
      const result = validateProfileInput({});

      expect(result).toEqual({});
    });

    it('should handle null and undefined values', () => {
      const profileWithUndefined = {
        name: undefined,
        gender: undefined,
        active: undefined
      };

      const result = validateProfileInput(profileWithUndefined);

      expect(result).toEqual(profileWithUndefined);
    });

    it('should validate boolean fields', () => {
      const profile = {
        active: false,
        hasLike: true,
        hasView: false
      };

      const result = validateProfileInput(profile);

      expect(result).toEqual(profile);
    });

    it('should validate numeric fields', () => {
      const profile = {
        imageCount: 10,
        likeCount: 25,
        viewCount: 150
      };

      const result = validateProfileInput(profile);

      expect(result).toEqual(profile);
    });

    it('should validate array fields', () => {
      const profile = {
        images: [{id: 'img1'}, {id: 'img2'}],
        tags: [{name: 'tag1'}, {name: 'tag2'}]
      };

      const result = validateProfileInput(profile);

      expect(result).toEqual(profile);
    });
  });

  describe('formatProfileOutput', () => {
    it('should return profile as-is', () => {
      const profile = {
        active: true,
        gender: 'M',
        name: 'John Doe'
      };

      const result = formatProfileOutput(profile);

      expect(result).toBe(profile);
    });

    it('should handle empty profile', () => {
      const result = formatProfileOutput({});

      expect(result).toEqual({});
    });
  });

  describe('parseProfile', () => {
    it('should parse profile with all fields', () => {
      const profile = {
        _id: 'profiles/123',
        _key: '123',
        active: true,
        gender: 'M',
        hasLike: true,
        hasView: false,
        imageCount: 5,
        imageId: 'image-123',
        imageUrl: 'https://example.com/profile.jpg',
        images: [{url: 'https://example.com/image.jpg'}],
        likeCount: 42,
        name: 'John Doe',
        profileId: 'profile-123',
        tags: [{name: 'developer'}],
        thumbUrl: 'https://example.com/thumb.jpg',
        userId: 'user-123',
        viewCount: 100
      };

      const result = parseProfile(profile);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('profileId');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('gender');
      expect(result).toHaveProperty('active');
      expect(result).toHaveProperty('hasLike');
      expect(result).toHaveProperty('hasView');
      expect(result).toHaveProperty('imageCount');
      expect(result).toHaveProperty('likeCount');
      expect(result).toHaveProperty('viewCount');
      expect(result).toHaveProperty('userId');
    });

    it('should parse profile with minimal fields', () => {
      const profile = {
        name: 'Jane Doe'
      };

      const result = parseProfile(profile);

      expect(result).toHaveProperty('name');
      expect(result.name).toBe('Jane Doe');
    });

    it('should handle profile with only ID fields', () => {
      const profile = {
        _id: 'profiles/123',
        _key: '123'
      };

      const result = parseProfile(profile);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('profileId');
    });

    it('should handle boolean fields', () => {
      const profile = {
        active: 'true',
        hasLike: 'false',
        hasView: 'true',
        name: 'John Doe'
      };

      const result = parseProfile(profile);

      expect(result).toHaveProperty('active');
      expect(result).toHaveProperty('hasLike');
      expect(result).toHaveProperty('hasView');
      expect(typeof result.active).toBe('boolean');
      expect(typeof result.hasLike).toBe('boolean');
      expect(typeof result.hasView).toBe('boolean');
    });

    it('should handle numeric fields', () => {
      const profile = {
        imageCount: '10',
        likeCount: '25',
        name: 'John Doe',
        viewCount: '150'
      };

      const result = parseProfile(profile);

      expect(result).toHaveProperty('imageCount');
      expect(result).toHaveProperty('likeCount');
      expect(result).toHaveProperty('viewCount');
      expect(typeof result.imageCount).toBe('number');
      expect(typeof result.likeCount).toBe('number');
      expect(typeof result.viewCount).toBe('number');
    });

    it('should handle long name', () => {
      const longName = 'a'.repeat(100);
      const profile = {
        name: longName
      };

      const result = parseProfile(profile);

      expect(result).toHaveProperty('name');
      expect(result.name.length).toBeLessThanOrEqual(64);
    });

    it('should handle long gender', () => {
      const profile = {
        gender: 'MALE',
        name: 'John Doe'
      };

      const result = parseProfile(profile);

      expect(result).toHaveProperty('gender');
      expect(result.gender.length).toBeLessThanOrEqual(1);
    });

    it('should handle images array', () => {
      const profile = {
        images: [
          {url: 'https://example.com/img1.jpg'},
          {url: 'https://example.com/img2.jpg'}
        ],
        name: 'John Doe'
      };

      const result = parseProfile(profile);

      expect(result).toHaveProperty('images');
      expect(Array.isArray(result.images)).toBe(true);
    });

    it('should handle tags array', () => {
      const profile = {
        name: 'John Doe',
        tags: [
          {name: 'developer'},
          {name: 'designer'}
        ]
      };

      const result = parseProfile(profile);

      expect(result).toHaveProperty('tags');
      expect(Array.isArray(result.tags)).toBe(true);
    });

    it('should handle empty arrays', () => {
      const profile = {
        images: [],
        name: 'John Doe',
        tags: []
      };

      const result = parseProfile(profile);

      expect(result).toHaveProperty('name');
      expect(result.name).toBe('John Doe');
    });

    it('should handle profile with empty values', () => {
      const profile = {
        name: 'John Doe',
        gender: 'M',
        active: false,
        imageCount: 0,
        likeCount: 0,
        viewCount: 0
      };

      const result = parseProfile(profile);

      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('active');
      expect(result).toHaveProperty('imageCount');
      expect(result).toHaveProperty('likeCount');
      expect(result).toHaveProperty('viewCount');
    });

    it('should preserve URL fields', () => {
      const profile = {
        imageUrl: 'https://example.com/profile.jpg',
        name: 'John Doe',
        thumbUrl: 'https://example.com/thumb.jpg'
      };

      const result = parseProfile(profile);

      expect(result).toHaveProperty('imageUrl');
      expect(result).toHaveProperty('thumbUrl');
      expect(result.imageUrl).toBe(profile.imageUrl);
      expect(result.thumbUrl).toBe(profile.thumbUrl);
    });
  });

  describe('ProfileValidationError', () => {
    it('should create ProfileValidationError with message', () => {
      const error = new ProfileValidationError('Test error');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ProfileValidationError);
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('ProfileValidationError');
    });

    it('should create ProfileValidationError with message and field', () => {
      const error = new ProfileValidationError('Test error', 'name');

      expect(error.message).toBe('Test error');
      expect(error.field).toBe('name');
    });
  });
});