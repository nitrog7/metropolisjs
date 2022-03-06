/**
 * Copyright (c) 2021-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import isUndefined from 'lodash/isUndefined';

export class Adapter {
  getValues(props: string[]): any {
    return props.reduce((jsonObj: object, key: string) => {
      const value: any = this[key];

      if(!isUndefined(value)) {
        jsonObj[key] = value;
      }

      return jsonObj;
    }, {});
  }

  toJson(): any {
    return this.toJSON();
  }

  toJSON(): any { // eslint-disable-line
    const proto = Object.getPrototypeOf(this);

    return Object.getOwnPropertyNames(this).reduce((jsonObj: object, key: string) => {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      const value: any = this[key];

      if(desc && typeof desc.get === 'function' && !isUndefined(value)) {
        jsonObj[key] = value;
      } else if(typeof value === 'bigint') {
        jsonObj[key] = value.toString();
      } else if(!isUndefined(value)) {
        jsonObj[key] = value;
      }

      return jsonObj;
    }, {});
  }
}
