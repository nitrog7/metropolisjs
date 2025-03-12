/**
 * Copyright (c) 2021-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {parseBoolean, parseChar, parseVarChar} from '@nlabs/utils';
import isNil from 'lodash/isNil';
import isUndefined from 'lodash/isUndefined';

import {Adapter} from './Adapter';

export interface TagData {
  readonly _id?: string;
  readonly _key?: string;
  readonly added?: number | string;
  readonly category?: string;
  readonly id?: string;
  readonly isTagged?: boolean;
  readonly modified?: number | string;
  readonly name?: string;
  readonly tagId?: string;
}

export class Tag extends Adapter {
  static TYPE = 'tags';
  static TYPE_ID = 'tagId';

  category?: string;
  isTagged: boolean;
  name?: string;
  tagId: string;

  constructor(data: Partial<TagData>) {
    super(data);

    const {category, isTagged, name} = data;

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
