import { LocationValidationError, parseLocation, validateLocationInput } from './locationAdapter';

describe('locationAdapter', () => {
  describe('validateLocationInput', () => {
    it('should validate valid location input', () => {
      const validLocation = {
        locationId: 'loc123',
        address: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
        zip: '12345',
        latitude: 40.7128,
        longitude: -74.0060
      };

      const result = validateLocationInput(validLocation);
      expect(result).toEqual(validLocation);
    });

    it('should handle minimal location input', () => {
      const minimalLocation = {
        locationId: 'loc123',
        address: '123 Test St'
      };

      const result = validateLocationInput(minimalLocation);
      expect(result).toEqual(minimalLocation);
    });

    it('should throw LocationValidationError for invalid input', () => {
      const invalidLocation = {
        locationId: 123, // should be string
        latitude: 'invalid' // should be number
      } as unknown;

      expect(() => validateLocationInput(invalidLocation)).toThrow(LocationValidationError);
    });

    it('should handle additional properties', () => {
      const locationWithExtra = {
        locationId: 'loc123',
        address: '123 Test St',
        customField: 'value'
      };

      const result = validateLocationInput(locationWithExtra);
      expect(result).toEqual(locationWithExtra);
    });
  });

  describe('parseLocation', () => {
    it('should parse location with all fields', () => {
      const location = {
        _id: 'locations/123',
        _key: '123',
        locationId: 'loc123',
        address: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
        zip: '12345',
        latitude: 40.7128,
        longitude: -74.0060,
        timezone: 'America/New_York',
        cached: 1234567890,
        modified: 1234567890
      };

      const result = parseLocation(location);
      expect(result.locationId).toBe('loc123');
      expect(result.address).toBe('123 Test St');
      expect(result.city).toBe('Test City');
      expect(result.state).toBe('Test State');
      expect(result.country).toBe('Test Country');
      expect(result.zip).toBe('12345');
      expect(result.latitude).toBe(40.7128);
      expect(result.longitude).toBe(-74.0060);
      expect(result.timezone).toBe('America/New_York');
      expect(result.cached).toBe(1234567890);
      expect(result.modified).toBe(1234567890);
    });

    it('should handle location with minimal fields', () => {
      const minimalLocation = {
        locationId: 'loc123',
        address: '123 Test St'
      };

      const result = parseLocation(minimalLocation);
      expect(result.locationId).toBe('loc123');
      expect(result.address).toBe('123 Test St');
      expect(result.city).toBeUndefined();
      expect(result.latitude).toBeUndefined();
    });

    it('should parse ArangoDB fields correctly', () => {
      const location = {
        _id: 'locations/123',
        _key: '123',
        locationId: 'loc123'
      };

      const result = parseLocation(location);
      expect(result.id).toBe('locations/123');
      expect(result.locationId).toBe('loc123');
    });

    it('should handle numeric fields', () => {
      const location = {
        locationId: 'loc123',
        address: '123 Test St',
        latitude: '40.7128',
        longitude: '-74.0060',
        cached: '1234567890',
        modified: '1234567890'
      } as any;

      const result = parseLocation(location);
      expect(result.latitude).toBe(40.7128);
      expect(result.longitude).toBe(-74.0060);
      expect(result.cached).toBe(1234567890);
      expect(result.modified).toBe(1234567890);
    });

    it('should throw LocationValidationError for invalid location', () => {
      const invalidLocation = {
        locationId: 123, // should be string
        latitude: 'invalid' // should be number
      } as unknown;

      expect(() => parseLocation(invalidLocation as any)).toThrow(LocationValidationError);
    });
  });

  describe('LocationValidationError', () => {
    it('should create error with message', () => {
      const error = new LocationValidationError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('LocationValidationError');
    });

    it('should create error with field', () => {
      const error = new LocationValidationError('Test error', 'testField');
      expect(error.message).toBe('Test error');
      expect(error.field).toBe('testField');
    });
  });
}); 