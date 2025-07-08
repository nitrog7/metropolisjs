import {EventValidationError, parseEvent, validateEventInput} from './eventAdapter';

describe('eventAdapter', () => {
  describe('validateEventInput', () => {
    it('should validate valid event input', () => {
      const validEvent = {
        eventId: 'event1',
        name: 'Test Event',
        content: 'Event description',
        startDate: 1234567890,
        endDate: 1234567890,
        address: '123 Test St',
        latitude: 40.7128,
        longitude: -74.0060
      };

      const result = validateEventInput(validEvent);
      expect(result).toEqual(validEvent);
    });

    it('should handle minimal event input', () => {
      const minimalEvent = {
        eventId: 'event1',
        name: 'Test Event'
      };

      const result = validateEventInput(minimalEvent);
      expect(result).toEqual(minimalEvent);
    });

    it('should throw EventValidationError for invalid input', () => {
      const invalidEvent = {
        eventId: 'event1',
        startDate: 'invalid-date'
      } as unknown;

      expect(() => validateEventInput(invalidEvent)).toThrow(Error);
    });

    it('should handle location as object', () => {
      const eventWithLocation = {
        eventId: 'event1',
        name: 'Test Event',
        location: {
          address: '123 Test St',
          latitude: 40.7128,
          longitude: -74.0060
        }
      };

      const result = validateEventInput(eventWithLocation);
      expect(result).toEqual(eventWithLocation);
    });

    it('should handle location as string', () => {
      const eventWithLocationString = {
        eventId: 'event1',
        name: 'Test Event',
        location: '123 Test St, Test City'
      };

      const result = validateEventInput(eventWithLocationString);
      expect(result).toEqual(eventWithLocationString);
    });
  });

  describe('parseEvent', () => {
    it('should parse event with all fields', () => {
      const event = {
        _id: 'events/event1',
        _key: 'event1',
        eventId: 'event1',
        name: 'Test Event',
        content: 'Event description',
        startDate: 1234567890,
        endDate: 1234567890,
        address: '123 Test St',
        latitude: 40.7128,
        longitude: -74.0060,
        groupId: 'group1',
        postId: 'post1',
        type: 'meetup',
        rsvpCount: 50,
        viewCount: 100,
        isGoing: true,
        reactions: ['like', 'love'],
        tags: [{tagId: 'tag1', name: 'Technology'}],
        images: [{imageId: 'img1', url: 'image.jpg'}],
        mentions: [{userId: 'user1', username: 'user1'}],
        user: {userId: 'user1', username: 'organizer'},
        cached: 1234567890,
        modified: 1234567890
      };

      const result = parseEvent(event);
      expect(result.eventId).toBe('event1');
      expect(result.name).toBe('Test Event');
      expect(result.content).toBe('Event description');
      expect(result.startDate).toBe(1234567890);
      expect(result.endDate).toBe(1234567890);
      expect(result.address).toBe('123 Test St');
      expect(result.latitude).toBe(40.7128);
      expect(result.longitude).toBe(-74.0060);
      expect(result.groupId).toBe('group1');
      expect(result.postId).toBe('post1');
      expect(result.type).toBe('meetup');
      expect(result.rsvpCount).toBe(50);
      expect(result.viewCount).toBe(100);
      expect(result.isGoing).toBe(true);
      expect(result.reactions).toEqual(['like', 'love']);
      expect(result.tags).toBeDefined();
      expect(result.images).toBeDefined();
      expect(result.mentions).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.cached).toBe(1234567890);
      expect(result.modified).toBe(1234567890);
    });

    it('should handle event with minimal fields', () => {
      const minimalEvent = {
        eventId: 'event1',
        name: 'Test Event'
      };

      const result = parseEvent(minimalEvent);
      expect(result.eventId).toBe('event1');
      expect(result.name).toBe('Test Event');
      expect(result.content).toBeUndefined();
      expect(result.startDate).toBeUndefined();
    });

    it('should parse ArangoDB fields correctly', () => {
      const event = {
        _id: 'events/event1',
        _key: 'event1',
        eventId: 'event1'
      };

      const result = parseEvent(event);
      expect(result.id).toBe('events/event1');
      expect(result.eventId).toBe('event1');
    });

    it('should handle location object transformation', () => {
      const event = {
        eventId: 'event1',
        name: 'Test Event',
        location: {
          address: '123 Test St',
          latitude: 40.7128,
          longitude: -74.0060
        }
      };

      const result = parseEvent(event);
      expect(result.address).toBe('123 Test St');
      expect(result.latitude).toBe(40.7128);
      expect(result.longitude).toBe(-74.0060);
    });

    it('should handle boolean fields', () => {
      const event = {
        eventId: 'event1',
        name: 'Test Event',
        isGoing: true
      };

      const result = parseEvent(event);
      expect(result.isGoing).toBe(true);
    });

    it('should handle numeric fields', () => {
      const event = {
        eventId: 'event1',
        name: 'Test Event',
        latitude: 40.7128,
        longitude: -74.0060,
        startDate: 1234567890,
        endDate: 1234567890,
        rsvpCount: 50,
        viewCount: 100,
        cached: 1234567890
      };

      const result = parseEvent(event);
      expect(result.latitude).toBe(40.7128);
      expect(result.longitude).toBe(-74.0060);
      expect(result.startDate).toBe(1234567890);
      expect(result.endDate).toBe(1234567890);
      expect(result.rsvpCount).toBe(50);
      expect(result.viewCount).toBe(100);
      expect(result.cached).toBe(1234567890);
    });
  });

  describe('EventValidationError', () => {
    it('should create error with message', () => {
      const error = new EventValidationError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('EventValidationError');
    });

    it('should create error with field', () => {
      const error = new EventValidationError('Test error', 'testField');
      expect(error.message).toBe('Test error');
      expect(error.field).toBe('testField');
    });
  });
});