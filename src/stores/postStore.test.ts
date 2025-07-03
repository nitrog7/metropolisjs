/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {PostConstants, posts, defaultValues} from './postStore';

describe('postStore', () => {
  it('should listen for default', () => {
    const updatedState = posts('', {}, defaultValues);
    return expect(updatedState).toBe(defaultValues);
  });

  it('should listen for GET_LIST_SUCCESS', () => {
    const updatedState = posts(PostConstants.GET_LIST_SUCCESS, {}, defaultValues);
    return expect(updatedState).toBe(defaultValues);
  });
});
