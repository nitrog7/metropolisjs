/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {defaultValues, LOCATION_CONSTANTS, locationStore} from './locationStore';

describe('locationStore', () => {
  it('should listen for default', () => {
    const updatedState = locationStore('', {}, defaultValues);
    return expect(updatedState).toBe(defaultValues);
  });

  it('should listen for SET_CURRENT', () => {
    const updatedState = locationStore(LOCATION_CONSTANTS.SET_CURRENT, {}, defaultValues);
    return expect(updatedState).toEqual(defaultValues);
  });
});
