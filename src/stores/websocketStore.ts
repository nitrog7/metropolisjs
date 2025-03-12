/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */

export class WebSocketConstants {
  static readonly CLOSE: string = 'WEBSOCKET_CLOSE';
  static readonly ERROR: string = 'WEBSOCKET_ERROR';
  static readonly OPEN: string = 'WEBSOCKET_OPEN';
  static readonly MESSAGE: string = 'WEBSOCKET_MESSAGE';
}

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
    case WebSocketConstants.CLOSE: {
      return {...state, isOpen: false};
    }
    case WebSocketConstants.OPEN: {
      return {...state, isOpen: true};
    }
    default: {
      return {...state, ...data};
    }
  }
};
