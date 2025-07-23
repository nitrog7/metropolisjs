/**
 * Copyright (c) 2025-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {jest} from '@jest/globals';
import {FluxFramework} from '@nlabs/arkhamjs';

import {CONTENT_CONSTANTS} from '../../stores/contentStore';

// Mock fetch globally for ESM compatibility
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true
  } as Response)
);

// Mock API functions
const mockAppMutation = jest.fn();
const mockAppQuery = jest.fn();

jest.unstable_mockModule('../../utils/api', () => ({
  ...(jest.requireActual('../../utils/api') as any),
  appMutation: mockAppMutation,
  appQuery: mockAppQuery
}));

describe('contentActions', () => {
  let flux: FluxFramework;
  let contentActions: any;
  let createContentActions: any;

  beforeEach(async () => {
    // Reset mocks
    mockAppMutation.mockClear();
    mockAppQuery.mockClear();

    // Setup flux
    flux = new FluxFramework();
    flux.dispatch = jest.fn() as any;
    flux.getState = jest.fn() as any;

    // Import the module under test (must be after mocks are set up)
    const module = await import('./contentActions');
    createContentActions = module.createContentActions;
    contentActions = createContentActions(flux);
  });

  afterAll(jest.restoreAllMocks);

  describe('factory function', () => {
    it('should create actions with flux framework', () => {
      expect(contentActions).toBeDefined();
      expect(typeof contentActions.add).toBe('function');
      expect(typeof contentActions.itemById).toBe('function');
      expect(typeof contentActions.update).toBe('function');
    });

    it('should use custom adapter when provided', () => {
      const customContentAdapter = jest.fn().mockImplementation((input: any) => input);
      const actions = createContentActions(flux, {
        contentAdapter: customContentAdapter
      });
      expect(actions).toBeDefined();
    });
  });

  describe('add', () => {
    it('should add content and dispatch success action', async () => {
      const contentData = {
        key: 'welcome_message',
        locale: 'en' as const,
        content: 'Welcome to our app!'
      };

      const mockResponse = {
        contents: {
          addContent: {
            contentId: '123',
            ...contentData
          }
        }
      };

      mockAppMutation.mockResolvedValue({
        content: mockResponse.contents.addContent
      });

      const result = await contentActions.add(contentData);

      expect(mockAppMutation).toHaveBeenCalled();
      expect(flux.dispatch).toHaveBeenCalledWith({
        content: mockResponse.contents.addContent,
        type: CONTENT_CONSTANTS.ADD_ITEM_SUCCESS
      });
      expect(result).toEqual(mockResponse.contents.addContent);
    });

    it('should handle errors when adding content', async () => {
      const contentData = {
        key: 'welcome_message',
        locale: 'en' as const,
        content: 'Welcome to our app!'
      };

      const error = new Error('Failed to add content');
      mockAppMutation.mockRejectedValue(error);

      await expect(contentActions.add(contentData)).rejects.toThrow('Failed to add content');
      expect(flux.dispatch).toHaveBeenCalledWith({
        error,
        type: CONTENT_CONSTANTS.ADD_ITEM_ERROR
      });
    });
  });

  describe('itemById', () => {
    it('should fetch content by id and dispatch success action', async () => {
      const mockResponse = {
        contents: {
          getContent: {
            contentId: '123',
            key: 'welcome_message',
            locale: 'en',
            content: 'Welcome to our app!'
          }
        }
      };

      mockAppQuery.mockResolvedValue({
        content: mockResponse.contents.getContent
      });

      const result = await contentActions.itemById('123');

      expect(mockAppQuery).toHaveBeenCalled();
      expect(flux.dispatch).toHaveBeenCalledWith({
        content: mockResponse.contents.getContent,
        type: CONTENT_CONSTANTS.GET_ITEM_SUCCESS
      });
      expect(result).toEqual(mockResponse.contents.getContent);
    });
  });
});