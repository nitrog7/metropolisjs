/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {
  parseArangoId,
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

import {parseDateTime} from '../utils/dateUtils';
import {Adapter} from './Adapter';
import {Tag} from './Tag';

export class User extends Adapter {
  active: boolean;
  added: number;
  address: string;
  birthday: number;
  city: string;
  country: string;
  dobDay: number;
  dobMonth: number;
  dobYear: number;
  email: string;
  expires: number;
  gender: string;
  hasLike: boolean;
  hasView: boolean;
  id: string;
  images: any[];
  imageCount: number;
  imageId: string;
  imageUrl: string;
  issued: number;
  latitude: number;
  likeCount: number;
  longitude: number;
  mailingList: boolean;
  modified: number;
  password: string;
  phone: string;
  photoCount: number;
  state: string;
  street: string;
  tags: Tag[];
  timestamp: number;
  thumbUrl: string;
  token: string;
  userAccess: number;
  userId: string;
  username: string;
  viewCount: number;
  zip: string;

  constructor(data: Partial<User>) {
    super();

    const {
      active,
      added,
      address,
      city,
      country,
      email,
      expires,
      hasLike,
      hasView,
      id,
      images,
      imageCount,
      imageId,
      imageUrl,
      issued,
      latitude,
      likeCount,
      longitude,
      modified,
      password,
      phone,
      photoCount,
      state,
      street,
      tags,
      thumbUrl,
      timestamp,
      token,
      username,
      userAccess,
      userId,
      viewCount,
      zip
    } = data;

    // Account
    if(!isNil(id)) {
      this.id = parseArangoId(id);
    } else if(!isNil(userId)) {
      this.id = `users/${parseId(userId)}`;
    }
    if(!isNil(userId)) {
      this.userId = parseId(userId);
    }
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
    if(!isNil(photoCount)) {
      this.photoCount = parseNum(photoCount);
    }
    if(!isNil(viewCount)) {
      this.viewCount = parseNum(viewCount);
    }

    // Active status
    if(!isNil(active)) {
      this.active = parseBoolean(active);
    }

    // Timestamp
    if(!isNil(added)) {
      this.added = parseDateTime(added);
    }
    if(!isNil(modified)) {
      this.modified = parseDateTime(modified);
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

    // Birthday
    const {dobDay, dobMonth, dobYear} = data;
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
        this.birthday = dobDate.toMillis();
      }
    }

    // Email
    if(isString(data.email)) {
      this.email = parseEmail(data.email);
    }

    // Gender
    if(isString(data.gender)) {
      this.gender = parseChar(data.gender, 1);
    }

    // Mailing list
    if(!isNil(data.mailingList)) {
      this.mailingList = parseBoolean(data.mailingList);
    }

    // Phone number
    if(isString(data.phone)) {
      this.phone = parsePhone(data.phone);
    }

    // Tags
    if(isArray(tags)) {
      this.tags = tags.map((tag) => new Tag(tag));
    }
  }

  getInput(): Partial<User> {
    return this.getValues([
      'address',
      'birthday',
      'city',
      'country',
      'email',
      'gender',
      'height',
      'imageId',
      'latitude',
      'longitude',
      'mailingList',
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
