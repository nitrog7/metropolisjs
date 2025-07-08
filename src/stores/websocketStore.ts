/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */

export const WEBSOCKET_CONSTANTS = {
  CLOSE: 'WEBSOCKET_CLOSE',
  ERROR: 'WEBSOCKET_ERROR',
  OPEN: 'WEBSOCKET_OPEN',
  MESSAGE: 'WEBSOCKET_MESSAGE'
} as const;

interface WebSocketState {
  isOpen: boolean;
  data?: unknown;
  timestamp?: number;
}

export const defaultValues: WebSocketState = {
  isOpen: false
};

export const websocketStore = (type: string, data: Partial<WebSocketState>, state = defaultValues): WebSocketState => {
  switch(type) {
    case WEBSOCKET_CONSTANTS.CLOSE: {
      return {...state, isOpen: false};
    }
    case WEBSOCKET_CONSTANTS.OPEN: {
      return {...state, isOpen: true};
    }
    case WEBSOCKET_CONSTANTS.MESSAGE: {
      return {...state, ...data};
    }
    default: {
      return {...state, ...data};
    }
  }
};

export const websocket = {
  action: websocketStore,
  name: 'websocket',
  initialState: defaultValues
};