/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
export const WEBSOCKET_CLOSE: string = 'WEBSOCKET_CLOSE';
export const WEBSOCKET_ERROR: string = 'WEBSOCKET_ERROR';
export const WEBSOCKET_OPEN: string = 'WEBSOCKET_OPEN';
export const WEBSOCKET_MESSAGE: string = 'WEBSOCKET_MESSAGE';

const defaultValues: any = {
  isOpen: false
};

export const websocketStore = (type: string, data, state = defaultValues): any => {
  switch(type) {
    case WEBSOCKET_CLOSE: {
      return {...state, isOpen: false};
    }
    case WEBSOCKET_OPEN: {
      return {...state, isOpen: true};
    }
    default: {
      return {...state, ...data};
    }
  }
};
