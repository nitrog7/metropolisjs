/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {websocket, defaultValues, WebSocketConstants} from './websocketStore';

describe('websocketStore', () => {
  it('should listen for default', () => {
    const updatedState = websocket('', {}, defaultValues);
    return expect(updatedState).toBe(defaultValues);
  });

  it('should listen for CLOSE', () => {
    const updatedState = websocket(WebSocketConstants.CLOSE, {}, defaultValues);
    return expect(updatedState).toBe(defaultValues);
  });

  it('should listen for OPEN', () => {
    const updatedState = websocket(WebSocketConstants.OPEN, {}, defaultValues);
    return expect(updatedState).toBe(defaultValues);
  });

  it('should listen for MESSAGE', () => {
    const updatedState = websocket(WebSocketConstants.MESSAGE, {}, defaultValues);
    return expect(updatedState).toBe(defaultValues);
  });
});
