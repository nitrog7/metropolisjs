/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {UserConstants, users, defaultValues} from './userStore';

describe('userStore', () => {
  it('should listen for default', () => {
    const updatedState = users('', {}, defaultValues);
    return expect(updatedState).toBe(defaultValues);
  });

  it('should listen for ADD_ITEM_SUCCESS', () => {
    const updatedState = users(UserConstants.ADD_ITEM_SUCCESS, {}, defaultValues);
    return expect(updatedState).toBe(defaultValues);
  });
});
