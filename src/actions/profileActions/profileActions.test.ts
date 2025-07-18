/**
 * Copyright (c) 2023-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import { FluxFramework } from '@nlabs/arkhamjs';

// Mock fetch globally for ESM compatibility
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true
  } as Response)
);

jest.unstable_mockModule('../../utils/api', () => ({
  ...(jest.requireActual('../../utils/api') as any),
  appMutation: jest.fn(),
  appQuery: jest.fn()
}));

describe('profileActions', () => {
  let flux: FluxFramework;
  let mockAppMutation: jest.Mock;
  let mockAppQuery: jest.Mock;
  let profileActions: any;

  beforeEach(async () => {
    jest.clearAllMocks();

    // Import modules after mocks are set up
    const apiModule = await import('../../utils/api');
    mockAppMutation = apiModule.appMutation as jest.Mock;
    mockAppQuery = apiModule.appQuery as jest.Mock;

    // Initialize flux
    flux = new FluxFramework({});
    flux.dispatch = jest.fn();
    flux.getState = jest.fn();

    // Import profileActions after mocks are set up
    const {createProfileActions} = await import('./profileActions');
    profileActions = createProfileActions(flux);
  });

  describe('addProfile', () => {
    it('should add a profile', async () => {
      const mockProfile = {
        profileId: '123',
        name: 'Test Profile'
      };

      mockAppMutation.mockResolvedValue({
        addProfile: mockProfile
      });

      const result = await profileActions.addProfile({name: 'Test Profile'});

      expect(mockAppMutation).toHaveBeenCalled();
      expect(result).toEqual(mockProfile);
      expect(flux.dispatch).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to add profile');
      mockAppMutation.mockRejectedValue(error);

      await expect(profileActions.addProfile({name: 'Test Profile'})).rejects.toThrow(error);
      expect(flux.dispatch).toHaveBeenCalled();
    });
  });

  describe('getProfile', () => {
    it('should get a profile by ID', async () => {
      const mockProfile = {
        profileId: '123',
        name: 'Test Profile'
      };

      mockAppQuery.mockResolvedValue({
        profile: mockProfile
      });

      const result = await profileActions.getProfile('123');

      expect(mockAppQuery).toHaveBeenCalled();
      expect(result).toEqual(mockProfile);
      expect(flux.dispatch).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to get profile');
      mockAppQuery.mockRejectedValue(error);

      await expect(profileActions.getProfile('123')).rejects.toThrow(error);
      expect(flux.dispatch).toHaveBeenCalled();
    });
  });

  describe('getProfiles', () => {
    it('should get multiple profiles by IDs', async () => {
      const mockProfiles = [
        {
          profileId: '123',
          name: 'Test Profile 1'
        },
        {
          profileId: '456',
          name: 'Test Profile 2'
        }
      ];

      mockAppQuery.mockResolvedValue({
        profiles: mockProfiles
      });

      const result = await profileActions.getProfiles(['123', '456']);

      expect(mockAppQuery).toHaveBeenCalled();
      expect(result).toEqual(mockProfiles);
      expect(flux.dispatch).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to get profiles');
      mockAppQuery.mockRejectedValue(error);

      await expect(profileActions.getProfiles(['123', '456'])).rejects.toThrow(error);
      expect(flux.dispatch).toHaveBeenCalled();
    });
  });

  describe('updateProfile', () => {
    it('should update a profile', async () => {
      const mockProfile = {
        profileId: '123',
        name: 'Updated Profile'
      };

      mockAppMutation.mockResolvedValue({
        updateProfile: mockProfile
      });

      const result = await profileActions.updateProfile({
        profileId: '123',
        name: 'Updated Profile'
      });

      expect(mockAppMutation).toHaveBeenCalled();
      expect(result).toEqual(mockProfile);
      expect(flux.dispatch).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to update profile');
      mockAppMutation.mockRejectedValue(error);

      await expect(profileActions.updateProfile({
        profileId: '123',
        name: 'Updated Profile'
      })).rejects.toThrow(error);
      expect(flux.dispatch).toHaveBeenCalled();
    });
  });

  describe('deleteProfile', () => {
    it('should delete a profile', async () => {
      const mockProfile = {
        profileId: '123'
      };

      mockAppMutation.mockResolvedValue({
        deleteProfile: mockProfile
      });

      const result = await profileActions.deleteProfile('123');

      expect(mockAppMutation).toHaveBeenCalled();
      expect(result).toEqual(mockProfile);
      expect(flux.dispatch).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to delete profile');
      mockAppMutation.mockRejectedValue(error);

      await expect(profileActions.deleteProfile('123')).rejects.toThrow(error);
      expect(flux.dispatch).toHaveBeenCalled();
    });
  });
});