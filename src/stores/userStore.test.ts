/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {defaultValues, USER_CONSTANTS, userStore} from './userStore';

describe('userStore', () => {
  it('should listen for default', () => {
    const updatedState = userStore('', {}, defaultValues);
    return expect(updatedState).toBe(defaultValues);
  });

  it('should listen for ADD_ITEM_SUCCESS', () => {
    const mockUser = {
      userId: 'test-id',
      toJson: () => ({userId: 'test-id', name: 'Test User'})
    };
    const updatedState = userStore(USER_CONSTANTS.ADD_ITEM_SUCCESS, {user: mockUser}, defaultValues);
    expect(updatedState.users['test-id']).toEqual({userId: 'test-id', name: 'Test User', timestamp: expect.any(Number)});
    expect(updatedState.session).toEqual(mockUser);
  });
});
