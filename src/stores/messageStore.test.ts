/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {MessageConstants, messages, defaultValues} from './messageStore';

describe('messageStore', () => {
  it('should listen for default', () => {
    const updatedState = messages('', {}, defaultValues);
    return expect(updatedState).toBe(defaultValues);
  });

  it('should listen for GET_CONVO_LIST_SUCCESS', () => {
    const updatedState = messages(MessageConstants.GET_CONVO_LIST_SUCCESS, {}, defaultValues);
    return expect(updatedState).toBe(defaultValues);
  });
});
