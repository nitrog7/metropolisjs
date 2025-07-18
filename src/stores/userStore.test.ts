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
      name: 'Test User',
      toJson: () => ({name: 'Test User', userId: 'test-id'}),
      userId: 'test-id'
    };
    const updatedState = userStore(USER_CONSTANTS.ADD_ITEM_SUCCESS, {user: mockUser}, defaultValues);
    expect(updatedState.users['test-id']).toEqual({name: 'Test User', timestamp: expect.any(Number), userId: 'test-id'});
    expect(updatedState.session).toEqual(mockUser);
  });
});
