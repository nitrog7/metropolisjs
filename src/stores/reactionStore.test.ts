/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {reactions, defaultValues} from './reactionStore';

describe('reactionStore', () => {
  it('should listen for default', () => {
    const updatedState = reactions('', {}, defaultValues);
    return expect(updatedState).toBe(defaultValues);
  });
});
