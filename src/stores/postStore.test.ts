/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {defaultValues, POST_CONSTANTS, postStore} from './postStore';

describe('postStore', () => {
  it('should listen for default', () => {
    const updatedState = postStore('', {}, defaultValues);
    return expect(updatedState).toBe(defaultValues);
  });

  it('should listen for GET_LIST_SUCCESS', () => {
    const updatedState = postStore(POST_CONSTANTS.GET_LIST_SUCCESS, {}, defaultValues);
    return expect(updatedState).toBe(defaultValues);
  });
});
