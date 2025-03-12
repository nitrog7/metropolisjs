/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {websocketStore, defaultValues, WebSocketConstants} from './websocketStore';

describe('websocketStore', () => {
  it('should listen for default', () => {
    const updatedState = websocketStore('', {}, defaultValues);
    return expect(updatedState).toBe(defaultValues);
  });

  it('should listen for CLOSE', () => {
    const updatedState = websocketStore(WebSocketConstants.CLOSE, {}, defaultValues);
    return expect(updatedState).toBe(defaultValues);
  });

  it('should listen for OPEN', () => {
    const updatedState = websocketStore(WebSocketConstants.OPEN, {}, defaultValues);
    return expect(updatedState).toBe(defaultValues);
  });

  it('should listen for MESSAGE', () => {
    const updatedState = websocketStore(WebSocketConstants.MESSAGE, {}, defaultValues);
    return expect(updatedState).toBe(defaultValues);
  });
});
