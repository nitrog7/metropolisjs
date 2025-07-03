import { parsePersona, PersonaValidationError, validatePersonaInput } from './personaAdapter';

describe('personaAdapter', () => {
  describe('validatePersonaInput', () => {
    it('should validate valid persona input', () => {
      const validPersona = {
        personaId: 'persona123',
        name: 'Test Persona',
        description: 'A test persona',
        userId: 'user123',
        active: true
      };

      const result = validatePersonaInput(validPersona);
      expect(result).toEqual(validPersona);
    });

    it('should handle minimal persona input', () => {
      const minimalPersona = {
        personaId: 'persona123',
        name: 'Test Persona'
      };

      const result = validatePersonaInput(minimalPersona);
      expect(result).toEqual(minimalPersona);
    });

    it('should throw PersonaValidationError for invalid input', () => {
      const invalidPersona = {
        personaId: 123, // should be string
        name: 456 // should be string
      } as unknown;

      expect(() => validatePersonaInput(invalidPersona)).toThrow(PersonaValidationError);
    });

    it('should handle additional properties', () => {
      const personaWithExtra = {
        personaId: 'persona123',
        name: 'Test Persona',
        customField: 'value'
      };

      const result = validatePersonaInput(personaWithExtra);
      expect(result).toEqual(personaWithExtra);
    });
  });

  describe('parsePersona', () => {
    it('should parse persona with all fields', () => {
      const persona = {
        _id: 'personas/123',
        _key: '123',
        personaId: 'persona123',
        name: 'Test Persona',
        description: 'A test persona',
        userId: 'user123',
        user: {userId: 'user123', username: 'owner'},
        avatar: 'avatar.jpg',
        cover: 'cover.jpg',
        active: true,
        featured: true,
        cached: 1234567890,
        modified: 1234567890
      };

      const result = parsePersona(persona);
      expect(result.personaId).toBe('persona123');
      expect(result.name).toBe('Test Persona');
      expect(result.description).toBe('A test persona');
      expect(result.userId).toBe('user123');
      expect(result.user).toBeDefined();
      expect(result.avatar).toBe('avatar.jpg');
      expect(result.cover).toBe('cover.jpg');
      expect(result.active).toBe(true);
      expect(result.featured).toBe(true);
      expect(result.cached).toBe(1234567890);
      expect(result.modified).toBe(1234567890);
    });

    it('should handle persona with minimal fields', () => {
      const minimalPersona = {
        personaId: 'persona123',
        name: 'Test Persona'
      };

      const result = parsePersona(minimalPersona);
      expect(result.personaId).toBe('persona123');
      expect(result.name).toBe('Test Persona');
      expect(result.description).toBeUndefined();
      expect(result.userId).toBeUndefined();
    });

    it('should parse ArangoDB fields correctly', () => {
      const persona = {
        _id: 'personas/123',
        _key: '123',
        personaId: 'persona123'
      };

      const result = parsePersona(persona);
      expect(result.id).toBe('personas/123');
      expect(result.personaId).toBe('persona123');
    });

    it('should handle boolean fields', () => {
      const persona = {
        personaId: 'persona123',
        name: 'Test Persona',
        active: 'true',
        featured: 'false'
      } as any;

      const result = parsePersona(persona);
      expect(result.active).toBe(true);
      expect(result.featured).toBe(false);
    });

    it('should handle numeric fields', () => {
      const persona = {
        personaId: 'persona123',
        name: 'Test Persona',
        cached: '1234567890',
        modified: '1234567890'
      } as any;

      const result = parsePersona(persona);
      expect(result.cached).toBe(1234567890);
      expect(result.modified).toBe(1234567890);
    });

    it('should throw PersonaValidationError for invalid persona', () => {
      const invalidPersona = {
        personaId: 123, // should be string
        name: 456 // should be string
      } as unknown;

      expect(() => parsePersona(invalidPersona as any)).toThrow(PersonaValidationError);
    });
  });

  describe('PersonaValidationError', () => {
    it('should create error with message', () => {
      const error = new PersonaValidationError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('PersonaValidationError');
    });

    it('should create error with field', () => {
      const error = new PersonaValidationError('Test error', 'testField');
      expect(error.message).toBe('Test error');
      expect(error.field).toBe('testField');
    });
  });
}); 