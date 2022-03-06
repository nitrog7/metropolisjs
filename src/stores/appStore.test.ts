/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {app, defaultValues} from './appStore';

describe('appStore', () => {
  describe('app', () => {
    it('should listen for UPDATE', () => {
      const updatedState = app('UPDATE', {}, defaultValues);
      return expect(updatedState).toBe(defaultValues);
    });
  });
});
