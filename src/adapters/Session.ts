/**
 * Copyright (c) 2025-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {
  parseId,
  parseUsername
} from '@nlabs/utils';
import isNil from 'lodash/isNil';

import {Adapter} from './Adapter';
import {parseDateTime} from '../utils/dateUtils';

export interface SessionData {
  readonly expires: number;
  readonly issued: number;
  readonly token: string;
  readonly userId: string;
  readonly username: string;
}

export class Session extends Adapter {
  static TYPE = 'sessions';
  static TYPE_ID = 'sessionId';

  expires: number;
  issued: number;
  token: string;
  userId: string;
  username: string;

  constructor(data: Partial<SessionData>) {
    super(data);

    const {
      issued,
      expires,
      token,
      userId,
      username
    } = data;

    if(!isNil(expires)) {
      this.expires = parseDateTime(expires);
    }
    if(!isNil(issued)) {
      this.issued = parseDateTime(issued);
    }
    if(!isNil(token)) {
      this.token = token;
    }
    if(!isNil(userId)) {
      this.userId = parseId(userId);
    }
    if(!isNil(username)) {
      this.username = parseUsername(username);
    }
  }

  getInput(): Partial<Session> {
    return this.getValues([
      'expires',
      'issued',
      'token',
      'userId',
      'username'
    ]);
  }
}
