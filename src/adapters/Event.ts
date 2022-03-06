/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {parseArangoId, parseBoolean, parseId, parseNum, parseString} from '@nlabs/utils';
import isArray from 'lodash/isArray';
import isNil from 'lodash/isNil';
import isUndefined from 'lodash/isUndefined';

import {User} from '../adapters/User';
import {parseDateTime} from '../utils/dateUtils';
import {Adapter} from './Adapter';
import {Image} from './Image';
import {Tag} from './Tag';

export class Event extends Adapter {
  added?: number;
  address?: string;
  cached?: number;
  content: string;
  endDate?: number;
  eventId: string;
  groupId?: string;
  id: string;
  images: Image[];
  isGoing?: boolean;
  latitude?: number;
  longitude?: number;
  mentions?: User[];
  modified?: number;
  name?: string;
  postId: string;
  reactions?: string[];
  rsvpCount?: number;
  startDate: number;
  tags?: Tag[];
  type?: string;
  user?: User;
  viewCount?: number = 0;

  constructor(data: any) {
    super();

    const {
      _id,
      _key,
      added,
      address,
      cached,
      content,
      endDate,
      eventId,
      groupId,
      id,
      images,
      isGoing,
      latitude,
      location,
      longitude,
      mentions,
      modified,
      name,
      postId,
      reactions,
      rsvpCount,
      startDate,
      tags,
      type,
      user,
      viewCount
    } = data;

    // ID
    if(!isNil(_id) || !isNil(id)) {
      this.id = parseArangoId(_id || id);
    } else if(!isNil(eventId)) {
      this.id = `posts/${parseId(eventId)}`;
    }
    if(!isNil(_key) || !isNil(eventId)) {
      this.eventId = _key || eventId;
      this.postId = this.eventId;
    }

    if(!isUndefined(added)) {
      this.added = parseDateTime(added);
    }
    if(!isUndefined(modified)) {
      this.modified = parseDateTime(modified);
    }

    if(!isNil(cached)) {
      this.cached = parseNum(cached);
    }

    if(!isNil(content)) {
      this.content = parseString(content);
    }

    // Date
    if(!isUndefined(startDate)) {
      this.startDate = parseDateTime(startDate);
    }
    if(!isUndefined(endDate)) {
      this.endDate = parseDateTime(endDate);
    }

    if(!isNil(groupId)) {
      this.groupId = parseId(groupId);
    }

    if(!isNil(isGoing)) {
      this.isGoing = parseBoolean(isGoing);
    }

    // Location
    if(!isNil(address)) {
      this.address = parseString(address);
    }
    if(!isNil(latitude)) {
      this.latitude = parseNum(latitude);
    }
    if(!isNil(longitude)) {
      this.longitude = parseNum(longitude);
    }

    if(!isNil(location)) {
      if(typeof location === 'string') {
        this.address = parseString(location);
      } else {
        const {address, latitude, longitude} = location;
        this.address = parseString(address);
        this.latitude = parseNum(latitude);
        this.longitude = parseNum(longitude);
      }
    }

    if(!isNil(name)) {
      this.name = parseString(name);
    }

    if(!isNil(postId)) {
      this.postId = parseId(postId);
    }

    if(!isNil(type)) {
      this.type = parseString(type);
    }

    if(!isNil(user)) {
      this.user = user;
    }

    if(!isNil(rsvpCount)) {
      this.rsvpCount = rsvpCount;
    }

    if(!isNil(viewCount)) {
      this.viewCount = viewCount;
    }

    if(isArray(tags)) {
      this.mentions = mentions;
    }

    if(isArray(tags)) {
      this.reactions = reactions;
    }

    if(isArray(tags)) {
      this.tags = tags.map((tag) => new Tag(tag));
    }

    if(isArray(images)) {
      this.images = images.map((image) => new Image(image));
    }
  }

  getInput(): Partial<Event> {
    return this.getValues([
      'address',
      'content',
      'endDate',
      'groupId',
      'id',
      'latitude',
      'longitude',
      'name',
      'postId',
      'startDate',
      'tags'
    ]);
  }
}
