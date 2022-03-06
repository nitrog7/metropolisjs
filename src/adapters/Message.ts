/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {parseArangoId, parseId, parseString} from '@nlabs/utils/lib';
import isNil from 'lodash/isNil';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';

import {parseDateTime} from '../utils/dateUtils';
import {Adapter} from './Adapter';
import {User} from './User';

export class Message extends Adapter {
  added: number;
  content: string;
  conversationId: string;
  id: string;
  modified: number;
  messageId: string;
  position: string = 'left';
  user: User;

  constructor(data: any, sessionId: string) {
    super();

    const {_id, _key, added, content, conversationId, id, modified, messageId, user} = data;

    // ID
    if(!isNil(_id) || !isNil(id)) {
      this.id = parseArangoId(_id || id);
    } else if(!isNil(messageId)) {
      this.id = `posts/${parseId(messageId)}`;
    }
    if(!isNil(_key) || !isNil(messageId)) {
      this.messageId = _key || messageId;
    }

    if(!isUndefined(added)) {
      this.added = parseDateTime(added);
    }
    if(!isUndefined(modified)) {
      this.modified = parseDateTime(modified);
    }

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
