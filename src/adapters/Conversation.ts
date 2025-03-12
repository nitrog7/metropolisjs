/**
 * Copyright (c) 2021-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {parseString} from '@nlabs/utils';
import isNil from 'lodash/isNil';

import {Adapter} from './Adapter';
import {User} from './User';

export interface ConversationData {
  readonly _id?: string;
  readonly _key?: string;
  readonly added: number;
  readonly conversationId: string;
  readonly id: string;
  readonly isDirect: boolean;
  readonly modified: number;
  readonly name: string;
  readonly users: User[];
}

export class Conversation extends Adapter {
  static TYPE = 'conversations';
  static TYPE_ID = 'conversationId';

  conversationId: string;
  isDirect: boolean;
  name: string;
  users: User[];

  constructor(data: Partial<ConversationData>) {
    super(data);

    const {
      isDirect,
      name,
      users
    } = data;

    if(!isNil(isDirect)) {
      this.isDirect = !!isDirect;
    }

    if(!isNil(name)) {
      this.name = parseString(name);
    }

    this.users = users?.map((user) => new User(user));
  }

  getInput(): Partial<Conversation> {
    return {
      id: this.id,
      name: this.name,
      type: this.type
    };
  }
}

