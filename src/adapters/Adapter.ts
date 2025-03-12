/**
 * Copyright (c) 2021-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {parseArangoId, parseId} from '@nlabs/utils';
import isNil from 'lodash/isNil';

import {parseDateTime} from '../utils/dateUtils';

export class Adapter {
  static TYPE: string = '';
  static TYPE_ID: string = '';

  [key: string]: unknown;
  _id?: string;
  _key?: string;
  added?: number;
  id: string;
  modified?: number;

  constructor(data: Partial<Record<string, unknown>>) {
    const {_id, _key,added, id, modified} = data;
    const typeId = this.TYPE_ID as string;

    if(!isNil(_id)) {
      this.id = parseArangoId(_id as string);
    } else if(!isNil(id)) {
      this.id = parseArangoId(id as string);
    }

    if(!isNil(_key)) {
      this.id = parseArangoId(`${this.TYPE}/${_key}`);
      this[typeId] = parseId(_key as string);
    } else if(!isNil(data[typeId])) {
      this.id = parseArangoId(`${this.TYPE}/${data[typeId]}`);
      this[typeId] = parseId(data[typeId] as string);
    }

    // Timestamp
    if(!isNil(added)) {
      this.added = parseDateTime(added);
    }
    if(!isNil(modified)) {
      this.modified = parseDateTime(modified);
    }
  }

  getValues(props: string[]): Record<string, unknown> {
    return props.reduce((jsonObj: Record<string, unknown>, key: string) => {
      const value: unknown = this[key];

      if(value !== undefined) {
        jsonObj[key] = value;
      }

      return jsonObj;
    }, {});
  }

  toJson(): Record<string, unknown> {
    return this.toJSON();
  }

  toJSON(): Record<string, unknown> {
    const proto = Object.getPrototypeOf(this);

    return Object.getOwnPropertyNames(this).reduce((jsonObj: Record<string, unknown>, key: string) => {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      const value: unknown = this[key];

      if(desc && typeof desc.get === 'function' && value !== undefined) {
        jsonObj[key] = value;
      } else if(typeof value === 'bigint') {
        jsonObj[key] = value.toString();
      } else if(value !== undefined) {
        jsonObj[key] = value;
      }

      return jsonObj;
    }, {});
  }
}
