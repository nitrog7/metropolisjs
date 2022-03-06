/**
 * Copyright (c) 2021-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {parseArangoId, parseChar, parseId, parseNum, parseString, parseVarChar} from '@nlabs/utils';
import isNil from 'lodash/isNil';

import {parseDateTime} from '../utils/dateUtils';
import {Adapter} from './Adapter';

export class Location extends Adapter {
  added: number;
  address: string;
  city: string;
  country: string;
  id: string;
  locationId: string;
  latitude: number;
  longitude: number;
  modified: number;
  state: string;
  street: string;
  zip: string;

  constructor(data: any) {
    super();

    const {
      _id,
      _key,
      added,
      address,
      city,
      country,
      id,
      latitude,
      locationId,
      longitude,
      modified,
      state,
      street,
      zip
    } = data;

    // ID
    if(!isNil(_id) || !isNil(id)) {
      this.id = parseArangoId(_id || id);
    } else if(!isNil(locationId)) {
      this.id = `locations/${parseId(locationId)}`;
    }
    if(!isNil(_key) || !isNil(locationId)) {
      this.locationId = parseId(_key || locationId);
    } else if(!isNil(id)) {
      this.locationId = parseId(id.split('/')[1]);
    }

    if(!isNil(added)) {
      this.added = parseDateTime(added);
    }
    if(!isNil(modified)) {
      this.modified = parseDateTime(modified);
    }

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
