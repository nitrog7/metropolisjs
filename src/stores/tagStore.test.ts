/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {TagConstants, tags, defaultValues} from './tagStore';

describe('tagStore', () => {
  it('should listen for default', () => {
    const updatedState = tags('', {}, defaultValues);
    return expect(updatedState).toBe(defaultValues);
  });

  it('should listen for GET_LIST_SUCCESS', () => {
    const updatedState = tags(TagConstants.GET_LIST_SUCCESS, {}, defaultValues);
    return expect(updatedState).toEqual(expect.objectContaining({list: []}));
  });
});
