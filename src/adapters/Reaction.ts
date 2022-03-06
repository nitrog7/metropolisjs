/**
 * Copyright (c) 2021-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {parseArangoId, parseId, parseVarChar} from '@nlabs/utils';
import isNil from 'lodash/isNil';

import {parseDateTime} from '../utils/dateUtils';
import {Adapter} from './Adapter';

export class Reaction extends Adapter {
  added: number;
  id: string;
  name: string;
  reactionId: string;
  value: string;

  constructor(data: any) {
    super();

    const {_id, _key, added, id, name, reactionId, value} = data;

    // ID
    if(!isNil(_id) || !isNil(id)) {
      this.id = parseArangoId(_id || id);
    } else if(!isNil(reactionId)) {
      this.id = `reactions/${parseId(reactionId)}`;
    }
    if(!isNil(_key) || !isNil(reactionId)) {
      this.reactionId = parseId(_key || reactionId);
    } else if(!isNil(id)) {
      this.reactionId = parseId(id.split('/')[1]);
    }

    if(!isNil(added)) {
      this.added = parseDateTime(added);
    }

    if(!isNil(name)) {
      this.name = parseVarChar(name, 32);
    }

    if(!isNil(value)) {
      this.value = parseVarChar(value, 32);
    }
  }

  getInput(): Partial<Reaction> {
    return this.getValues(['name', 'value']);
  }
}
