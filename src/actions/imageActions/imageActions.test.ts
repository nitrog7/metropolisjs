jest.unstable_mockModule('@nlabs/rip-hunter', () => ({
  ...(jest.requireActual('@nlabs/rip-hunter') as any),
  ApiError: jest.fn(),
  graphqlQuery: jest.fn(),
  post: jest.fn()
}));

jest.unstable_mockModule('../../utils/file', () => ({
  convertFileToBase64: jest.fn().mockResolvedValue('data:image/png;base64,mockbase64string' as never)
}));

import {jest} from '@jest/globals';
import {FluxFramework} from '@nlabs/arkhamjs';
import {post} from '@nlabs/rip-hunter';
import {Config} from '../../config';
import {createImageActions} from './imageActions';

describe('imageActions with mocked HTTP requests', () => {
  let flux: FluxFramework;
  let imageActions: any;
  let mockPost: jest.MockedFunction<typeof post>;

  beforeEach(() => {
    flux = new FluxFramework();
    imageActions = createImageActions(flux);

    flux.dispatch = jest.fn() as any;
    flux.getState = jest.fn().mockReturnValue('mock-token' as never) as any;

    mockPost = post as jest.MockedFunction<typeof post>;
    // mockPost.mockClear();

    Config.setConfig({
      app: {
        api: {
          uploadImage: 'https://api.example.com/upload'
        }
      }
    });
  });

  afterAll(jest.restoreAllMocks);

  describe('upload functionality', () => {
    it('should mock post request for image upload', async () => {
      // Mock the post function to return a successful response
      mockPost.mockResolvedValue({
        data: {
          url: 'https://mock-upload-url.com/image.jpg',
          id: 'mock-upload-id'
        }
      });

      // Create a mock file
      const mockFile = new File(['mock-image-data'], 'test.jpg', {type: 'image/jpeg'});

      // Test the upload function
      const result = await imageActions.upload([mockFile], 'test-item-id', 'post');

      // Verify that post was called
      expect(mockPost).toHaveBeenCalledWith(
        'https://api.example.com/upload',
        expect.objectContaining({
          base64: expect.any(String),
          description: undefined,
          fileType: 'image/jpeg',
          itemId: 'test-item-id',
          itemType: 'post'
        }),
        expect.objectContaining({
          headers: expect.any(Headers)
        })
      );

      // Verify the mock response was returned
      expect(result).toEqual([undefined]);
    });

    it('should handle post request errors', async () => {
      // Mock the post function to throw an error
      const mockError = new Error('Upload failed');
      mockPost.mockRejectedValue(mockError);

      const mockFile = new File(['mock-image-data'], 'test.jpg', {type: 'image/jpeg'});

      // Test that the error is properly handled
      await expect(imageActions.upload([mockFile], 'test-item-id')).rejects.toThrow('Upload failed');

      // Verify that post was called
      expect(mockPost).toHaveBeenCalled();
    });

    it('should include authorization header in post request', async () => {
      mockPost.mockResolvedValue({
        data: {
          url: 'https://mock-upload-url.com/image.jpg',
          id: 'mock-upload-id'
        }
      });

      const mockFile = new File(['mock-image-data'], 'test.jpg', {type: 'image/jpeg'});

      await imageActions.upload([mockFile], 'test-item-id');

      // Verify that the authorization header was set
      expect(mockPost).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({
          headers: expect.any(Headers)
        })
      );

      // Get the headers that were passed to post
      const callArgs = mockPost.mock.calls[0];
      const headers = callArgs[2]?.headers;

      expect(headers?.get('Authorization')).toBe('Bearer mock-token');
    });
  });

  describe('add functionality', () => {
    it('should use post function for adding images', async () => {
      mockPost.mockResolvedValue({
        data: {
          url: 'https://mock-upload-url.com/image.jpg',
          id: 'mock-upload-id'
        }
      });

      const imageData = {
        base64: 'data:image/jpeg;base64,mock-base64-data',
        itemId: 'test-item-id'
      };

      await imageActions.add(imageData);

      expect(mockPost).toHaveBeenCalledWith(
        'https://api.example.com/upload',
        expect.objectContaining({
          base64: 'data:image/jpeg;base64,mock-base64-data',
          itemId: 'test-item-id',
          itemType: 'image'
        }),
        expect.any(Object)
      );
    });
  });
});