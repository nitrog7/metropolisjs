/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {parseId, parseString} from '@nlabs/utils/lib';
import isString from 'lodash/isString';

import {Adapter} from './Adapter';
import {User} from './User';

export interface MessageData {
  readonly _id?: string;
  readonly _key?: string;
  readonly added?: number | string;
  readonly content?: string;
  readonly conversationId?: string;
  readonly id?: string;
  readonly modified?: number | string;
  readonly messageId?: string;
  readonly user?: Record<string, unknown>;
}

export class Message extends Adapter {
  static TYPE = 'messages';
  static TYPE_ID = 'messageId';

  content: string;
  conversationId: string;
  messageId: string;
  position: string = 'left';
  user: User;

  constructor(data: Partial<MessageData>, sessionId: string) {
    super(data);

    const {content, conversationId, messageId, user} = data;

    if(isString(content)) {
      this.content = parseString(content);
    }

    if(isString(conversationId)) {
      this.conversationId = parseId(conversationId);
    }

    if(isString(messageId)) {
      this.messageId = parseId(messageId);
    }

    if(user) {
      this.user = new User(user);

      if(this.user.userId === sessionId) {
        this.position = 'right';
      }
    }
  }
}
