/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {EventConstants, eventStore, defaultValues} from './eventStore';

describe('eventStore', () => {
  it('should listen for EVENT_GET_LIST_SUCCESS', () => {
    const updatedState = eventStore(EventConstants.GET_LIST_SUCCESS, {}, defaultValues);
    return expect(updatedState).toBe(defaultValues);
  });
});
