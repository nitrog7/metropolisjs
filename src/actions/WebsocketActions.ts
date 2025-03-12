/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import Sockette from 'sockette';

import {Config} from '../config';
import {WebSocketConstants} from '../stores/websocketStore';

import type {FluxFramework} from '@nlabs/arkhamjs';

interface WebSocketMessage {
  type: string;
  payload?: Record<string, unknown>;
}

export class WebsocketActions {
  flux: FluxFramework;
  ws: Sockette;

  constructor(flux: FluxFramework) {
    this.flux = flux;
  }

  wsSend(message: WebSocketMessage) {
    console.log('websockets::onOpen::message', {ws: this.ws, message});
    if(this.ws) {
      this.ws.json(message);
    }
  }

  onReceive(event) {
    const {data: eventData, timeStamp: timestamp} = event;
    const data = JSON.parse(eventData);
    console.log('websockets::onRecieve::data', data);
    this.flux.dispatch({data, timestamp, type: WebSocketConstants.MESSAGE});
  }

  onClose(event) {
    console.log('websockets::onOpen::message', event);
    const {timeStamp: timestamp} = event;
    this.flux.dispatch({timestamp, type: WebSocketConstants.CLOSE});
  }

  onError(event) {
    const {timeStamp: timestamp} = event;
    this.flux.dispatch({timestamp, type: WebSocketConstants.ERROR});
  }

  onOpen(event) {
    console.log('websockets::onOpen::event', event);
    const {timeStamp: timestamp} = event;
    this.flux.dispatch({timestamp, type: WebSocketConstants.OPEN});
  }

  wsInit(token?: string): Sockette {
    if(this.ws) {
      return this.ws;
    }

    const websocketUrl: string = Config.get('app.urls.websocket');
    const sessionToken: string = token || this.flux.getState('user.session.token');

    if(sessionToken) {
      const url: string = `${websocketUrl}?token=${sessionToken}`;

      this.ws = new Sockette(url, {
        maxAttempts: 5,
        onclose: this.onClose.bind(this),
        onerror: this.onError.bind(this),
        onmessage: this.onReceive.bind(this),
        onopen: this.onOpen.bind(this),
        timeout: 60000
      });

      return this.ws;
    }

    return null;
  }
}
