/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {
  parseBoolean,
  parseChar,
  parseEmail,
  parseId,
  parseNum,
  parsePassword,
  parsePhone,
  parseString,
  parseUsername,
  parseVarChar
} from '@nlabs/utils';
import {isArray} from 'lodash';
import isNil from 'lodash/isNil';
import isString from 'lodash/isString';
import {DateTime} from 'luxon';

import {Adapter} from './Adapter';
import {Tag} from './Tag';
import {parseDateTime} from '../utils/dateUtils';

import type {Image} from './Image';

export interface UserData {
  readonly active: boolean;
  readonly added: number;
  readonly address: string;
  readonly city: string;
  readonly country: string;
  readonly dob: number;
  readonly dobDay: number;
  readonly dobMonth: number;
  readonly dobYear: number;
  readonly email: string;
  readonly expires: number;
  readonly gender: string;
  readonly hasLike: boolean;
  readonly hasView: boolean;
  readonly id: string;
  readonly images: Image[];
  readonly imageCount: number;
  readonly imageId: string;
  readonly imageUrl: string;
  readonly issued: number;
  readonly latitude: number;
  readonly likeCount: number;
  readonly longitude: number;
  readonly modified: number;
  readonly password: string;
  readonly phone: string;
  readonly state: string;
  readonly street: string;
  readonly tags: Tag[];
  readonly thumbUrl: string;
  readonly timestamp: number;
  readonly token: string;
  readonly userAccess: number;
  readonly userId: string;
  readonly username: string;
  readonly viewCount: number;
  readonly zip: string;
}

export class User extends Adapter {
  static TYPE = 'users';
  static TYPE_ID = 'userId';

  active: boolean;
  address: string;
  city: string;
  country: string;
  dob: number;
  dobDay: number;
  dobMonth: number;
  dobYear: number;
  email: string;
  expires: number;
  gender: string;
  hasLike: boolean;
  hasView: boolean;
  images: Image[];
  imageCount: number;
  imageId: string;
  imageUrl: string;
  issued: number;
  latitude: number;
  likeCount: number;
  longitude: number;
  password: string;
  phone: string;
  state: string;
  street: string;
  tags: Tag[];
  thumbUrl: string;
  timestamp: number;
  token: string;
  userAccess: number;
  userId: string;
  username: string;
  viewCount: number;
  zip: string;

  constructor(data: Partial<UserData>) {
    super(data);

    const {
      active,
      address,
      city,
      country,
      dob,
      dobDay,
      dobMonth,
      dobYear,
      email,
      expires,
      gender,
      hasLike,
      hasView,
      images,
      imageCount,
      imageId,
      imageUrl,
      issued,
      latitude,
      likeCount,
      longitude,
      password,
      phone,
      state,
      street,
      tags,
      thumbUrl,
      timestamp,
      token,
      userAccess,
      username,
      viewCount,
      zip
    } = data;

    // Account
    if(!isNil(email)) {
      this.email = parseEmail(email);
    }
    if(!isNil(password)) {
      this.password = parsePassword(password);
    }
    if(!isNil(phone)) {
      this.phone = parsePhone(phone);
    }
    if(!isNil(username)) {
      this.username = parseUsername(username);
    }
    if(!isNil(userAccess)) {
      this.userAccess = parseNum(userAccess);
    }

    // Authentication
    if(!isNil(token)) {
      this.token = token;
    }
    if(!isNil(issued)) {
      this.issued = parseDateTime(issued);
    }
    if(!isNil(expires)) {
      this.expires = parseDateTime(expires);
    }
    if(!isNil(timestamp)) {
      this.timestamp = Date.now();
    }

    // Stats
    if(!isNil(hasLike)) {
      this.hasLike = parseBoolean(hasLike);
    }
    if(!isNil(hasView)) {
      this.hasView = parseBoolean(hasView);
    }
    if(!isNil(likeCount)) {
      this.likeCount = parseNum(likeCount);
    }
    if(!isNil(viewCount)) {
      this.viewCount = parseNum(viewCount);
    }

    // Active status
    if(!isNil(active)) {
      this.active = parseBoolean(active);
    }

    // Location
    if(!isNil(address)) {
      this.address = parseString(address, 64);
    }
    if(!isNil(latitude)) {
      this.latitude = parseNum(latitude, 12);
    }
    if(!isNil(longitude)) {
      this.longitude = parseNum(longitude, 12);
    }
    if(isString(street)) {
      this.street = parseString(street, 64);
    }
    if(isString(city)) {
      this.city = parseVarChar(city, 32);
    }
    if(isString(state)) {
      this.state = parseChar(state.toUpperCase(), 2);
    }
    if(isString(country)) {
      this.country = parseChar(country.toUpperCase(), 2);
    }
    if(isString(zip)) {
      this.zip = parseVarChar(zip, 10);
    }

    // Images
    if(!isNil(images)) {
      this.images = images;
    }
    if(!isNil(imageCount)) {
      this.imageCount = parseNum(imageCount);
    }
    if(!isNil(imageId)) {
      this.imageId = parseId(imageId);
    }
    if(!isNil(imageUrl)) {
      this.imageUrl = imageUrl;
    }
    if(isString(thumbUrl)) {
      this.thumbUrl = thumbUrl;
    }

    // Profile
    if(!isNil(dobMonth) && !isNil(dobDay) && !isNil(dobYear)) {
      const dobDate: DateTime = DateTime.local().set({
        day: dobDay,
        hour: 0,
        millisecond: 0,
        minute: 0,
        month: dobMonth,
        second: 0,
        year: dobYear
      });
      const diffInDays: number = dobDate.diff(DateTime.local(), ['days']).days;

      if(diffInDays < 0) {
        this.dob = dobDate.toMillis();
      }
    }
    if(!isNil(dob)) {
      this.dob = parseDateTime(dob);
    }

    // Gender
    if(isString(gender)) {
      this.gender = parseChar(data.gender, 1);
    }

    // Tags
    if(isArray(tags)) {
      this.tags = tags.map((tag) => new Tag(tag));
    }
  }

  getInput(): Partial<User> {
    return this.getValues([
      'address',
      'city',
      'country',
      'dob',
      'email',
      'gender',
      'imageId',
      'latitude',
      'longitude',
      'password',
      'phone',
      'state',
      'street',
      'tags',
      'username',
      'zip'
    ]);
  }
}
