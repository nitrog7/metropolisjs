import { ImageValidationError, parseImage, validateImageInput } from './imageAdapter';

describe('imageAdapter', () => {
  describe('validateImageInput', () => {
    it('should validate valid image input', () => {
      const validImage = {
        imageId: 'img123',
        name: 'test-image.jpg',
        url: 'https://example.com/image.jpg',
        width: 1920,
        height: 1080,
        fileType: 'image/jpeg',
        size: 1024000
      };

      const result = validateImageInput(validImage);
      expect(result).toEqual(validImage);
    });

    it('should handle minimal image input', () => {
      const minimalImage = {
        imageId: 'img123',
        name: 'test-image.jpg'
      };

      const result = validateImageInput(minimalImage);
      expect(result).toEqual(minimalImage);
    });

    it('should throw ImageValidationError for invalid input', () => {
      const invalidImage = {
        imageId: 123, // should be string
        width: 'invalid' // should be number
      } as unknown;

      expect(() => validateImageInput(invalidImage)).toThrow(ImageValidationError);
    });

    it('should handle additional properties', () => {
      const imageWithExtra = {
        imageId: 'img123',
        name: 'test-image.jpg',
        customField: 'value'
      };

      const result = validateImageInput(imageWithExtra);
      expect(result).toEqual(imageWithExtra);
    });
  });

  describe('parseImage', () => {
    it('should parse image with all fields', () => {
      const image = {
        _id: 'images/123',
        _key: '123',
        imageId: 'img123',
        name: 'test-image.jpg',
        url: 'https://example.com/image.jpg',
        thumb: 'https://example.com/thumb.jpg',
        width: 1920,
        height: 1080,
        fileType: 'image/jpeg',
        size: 1024000,
        make: 'Canon',
        model: 'EOS R5',
        exposure: '1/1000',
        aperture: 'f/2.8',
        iso: 100,
        focalLength: '50mm',
        gps: {
          latitude: 40.7128,
          longitude: -74.0060
        },
        cached: 1234567890,
        modified: 1234567890
      };

      const result = parseImage(image);
      expect(result.imageId).toBe('img123');
      expect(result.name).toBe('test-image.jpg');
      expect(result.url).toBe('https://example.com/image.jpg');
      expect(result.thumb).toBe('https://example.com/thumb.jpg');
      expect(result.width).toBe(1920);
      expect(result.height).toBe(1080);
      expect(result.fileType).toBe('image/jpeg');
      expect(result.size).toBe(1024000);
      expect(result.make).toBe('Canon');
      expect(result.model).toBe('EOS R5');
      expect(result.exposure).toBe('1/1000');
      expect(result.aperture).toBe('f/2.8');
      expect(result.iso).toBe(100);
      expect(result.focalLength).toBe('50mm');
      expect(result.gps).toBeDefined();
      expect(result.cached).toBe(1234567890);
      expect(result.modified).toBe(1234567890);
    });

    it('should handle image with minimal fields', () => {
      const minimalImage = {
        imageId: 'img123',
        name: 'test-image.jpg'
      };

      const result = parseImage(minimalImage);
      expect(result.imageId).toBe('img123');
      expect(result.name).toBe('test-image.jpg');
      expect(result.url).toBeUndefined();
      expect(result.width).toBeUndefined();
    });

    it('should parse ArangoDB fields correctly', () => {
      const image = {
        _id: 'images/123',
        _key: '123',
        imageId: 'img123'
      };

      const result = parseImage(image);
      expect(result.id).toBe('images/123');
      expect(result.imageId).toBe('img123');
    });

    it('should handle numeric fields', () => {
      const image = {
        imageId: 'img123',
        name: 'test-image.jpg',
        width: '1920',
        height: '1080',
        size: '1024000',
        iso: '100',
        cached: '1234567890',
        modified: '1234567890'
      } as any;

      const result = parseImage(image);
      expect(result.width).toBe(1920);
      expect(result.height).toBe(1080);
      expect(result.size).toBe(1024000);
      expect(result.iso).toBe(100);
      expect(result.cached).toBe(1234567890);
      expect(result.modified).toBe(1234567890);
    });

    it('should throw ImageValidationError for invalid image', () => {
      const invalidImage = {
        imageId: 123, // should be string
        width: 'invalid' // should be number
      } as unknown;

      expect(() => parseImage(invalidImage as any)).toThrow(ImageValidationError);
    });
  });

  describe('ImageValidationError', () => {
    it('should create error with message', () => {
      const error = new ImageValidationError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('ImageValidationError');
    });

    it('should create error with field', () => {
      const error = new ImageValidationError('Test error', 'testField');
      expect(error.message).toBe('Test error');
      expect(error.field).toBe('testField');
    });
  });
}); 