/**
 * Copyright (c) 2021-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {parseArangoId, parseBoolean, parseChar, parseId, parseVarChar} from '@nlabs/utils';
import isNil from 'lodash/isNil';
import isUndefined from 'lodash/isUndefined';

import {parseDateTime} from '../utils/dateUtils';
import {Adapter} from './Adapter';

export class Tag extends Adapter {
  added?: number;
  category?: string;
  id: string;
  isTagged: boolean;
  modified?: number;
  name?: string;
  tagId: string;

  constructor(data: any) {
    super();

    const {_id, _key, added, category, id, isTagged, modified, name, tagId} = data;

    // ID
    if(!isNil(_id) || !isNil(id)) {
      this.id = parseArangoId(_id || id);
    } else if(!isNil(tagId)) {
      this.id = `tags/${parseId(tagId)}`;
    }
    if(!isNil(_key) || !isNil(tagId)) {
      this.tagId = parseId(_key || tagId);
    } else if(!isNil(id)) {
      this.tagId = parseId(id.split('/')[1]);
    }

    if(!isNil(added)) {
      this.added = parseDateTime(added);
    }
    if(!isNil(modified)) {
      this.modified = parseDateTime(modified);
    }

    if(!isNil(name)) {
      this.name = parseVarChar(name, 32);
    }

    if(!isNil(category)) {
      this.category = parseChar(category, 16);
    }

    if(!isUndefined(isTagged)) {
      this.isTagged = parseBoolean(isTagged);
    }
  }

  getInput(): Partial<Tag> {
    return this.getValues(['category', 'id', 'name', 'tagId']);
  }
}
