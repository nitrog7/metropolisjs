/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {ImageConstants, images, defaultValues} from './imageStore';

describe('imageStore', () => {
  it('should listen for default', () => {
    const updatedState = images('', {}, defaultValues);
    return expect(updatedState).toBe(defaultValues);
  });

  it('should listen for GET_LIST_SUCCESS', () => {
    const updatedState = images(ImageConstants.GET_LIST_SUCCESS, {}, defaultValues);
    return expect(updatedState).toBe(defaultValues);
  });
});
