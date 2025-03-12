/**
 * Copyright (c) 2021-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {parseChar, parseNum, parseString, parseVarChar} from '@nlabs/utils';
import isNil from 'lodash/isNil';

import {Adapter} from './Adapter';

export interface LocationData {
  readonly _id?: string;
  readonly _key?: string;
  readonly added?: number | string;
  readonly address?: string;
  readonly city?: string;
  readonly country?: string;
  readonly id?: string;
  readonly latitude?: number;
  readonly location?: string;
  readonly locationId?: string;
  readonly longitude?: number;
  readonly modified?: number | string;
  readonly state?: string;
  readonly street?: string;
  readonly zip?: string;
}

export class Location extends Adapter {
  static TYPE = 'locations';
  static TYPE_ID = 'locationId';

  address: string;
  city: string;
  country: string;
  locationId: string;
  latitude: number;
  longitude: number;
  state: string;
  street: string;
  zip: string;

  constructor(data: Partial<LocationData>) {
    super(data);

    const {
      address,
      city,
      country,
      latitude,
      longitude,
      state,
      street,
      zip
    } = data;

    if(!isNil(address)) {
      this.address = parseString(address, 128);
    }

    if(!isNil(street)) {
      this.street = parseString(street, 32);
    }

    if(!isNil(city)) {
      this.city = parseChar(city, 32);
    }

    if(!isNil(state)) {
      this.state = parseChar(state, 2);
    }

    if(!isNil(zip)) {
      this.zip = parseVarChar(zip, 16);
    }

    if(!isNil(country)) {
      this.country = parseChar(country, 2);
    }

    if(!isNil(latitude)) {
      this.latitude = parseNum(latitude, 2);
    }

    if(!isNil(longitude)) {
      this.longitude = parseNum(longitude, 2);
    }
  }

  getInput(): Partial<Location> {
    return this.getValues(['category', 'id', 'name', 'tagId']);
  }
}
