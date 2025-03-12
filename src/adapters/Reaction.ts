/**
 * Copyright (c) 2021-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {parseVarChar} from '@nlabs/utils';
import isNil from 'lodash/isNil';

import {Adapter} from './Adapter';

export interface ReactionData {
  readonly _id?: string;
  readonly _key?: string;
  readonly added?: number | string;
  readonly id?: string;
  readonly name?: string;
  readonly reactionId?: string;
  readonly value?: string;
}

export class Reaction extends Adapter {
  static TYPE = 'reactions';
  static TYPE_ID = 'reactionId';

  name: string;
  reactionId: string;
  value: string;

  constructor(data: Partial<ReactionData>) {
    super(data);

    const {name, value} = data;

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
